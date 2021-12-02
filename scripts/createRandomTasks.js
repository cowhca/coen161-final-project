const fs = require("fs").promises;
const path = require("path");
const mongodb = require("mongodb");
const faker = require("faker");

const TasksCollection = require("../mongodb/TasksCollection");

const REQUIRED_CONFIGURATION = [
  "username",
  "password",
  "address",
  "defaultDatabase",
];

const configurationFilePath = path.join(__dirname, "../", "config.json");

fs.readFile(configurationFilePath, "utf-8")
  .then((configRawContents) => {
    const config = JSON.parse(configRawContents);

    // before using the configuration file, make sure we have all the required keys
    const missingKeys = [];
    for (const key of REQUIRED_CONFIGURATION) {
      if (!config[key]) {
        missingKeys.push(key);
      }
    }

    if (missingKeys.length > 0) {
      console.log(
        `Configuration is invalid. Missing the following keys`,
        missingKeys
      );
      process.exit(1);
    }

    const authentication = `${config.username}:${config.password}`;
    const address = `${config.address}/${config.defaultDatabase}`;
    const options = "retryWrites=true&w=majority";
    const mongoURL = `mongodb+srv://${authentication}@${address}?${options}`;

    const client = new mongodb.MongoClient(mongoURL, {
      // useNewUrlParse: true,
      useUnifiedTopology: true,
    });

    return client.connect().then(() => {
      const collection = TasksCollection(client.db());

      // remove everything first so we start with a clean collection
      collection.drop().then(() => {
        const createTaskPromises = [];

        for (let i = 0; i < 500; i++) {
          const sentenceLength = Math.floor(Math.random() * 30);
          const description = faker.lorem.sentence(sentenceLength);
          const promise = collection.createTask(description);

          createTaskPromises.push(promise);
        }

        console.log("Queued 500 tasks to be created");

        return Promise.all(createTaskPromises).then(() => {
          console.log("finished creating all tasks");
          client.close();
        });
      });
    });
  })
  .catch((err) => console.log(err));
