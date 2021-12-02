const path = require("path");
const fs = require("fs").promises;
/**
 * There's an npm module called node-fetch which brings the browser based
 * fetch API to node.js. In your own projects, you can create 2 clients
 * one that's CLI based and one that's Web based and they can share similar
 * code.
 *
 * https://www.npmjs.com/package/node-fetch
 *
 * You will have to install v2 since we're using the require syntax to import
 * modules - npm install node-fetch@2
 */
const fetch = require("node-fetch");
/**
 * The commander library is good for creating command line tools. It was
 * extensively covered in the longer snippets server example
 */
const commander = require("commander");

const handleResponse = (response) => {
  const isSuccess = response.status >= 200 && response.status < 300;
  const isClientError = response.status >= 400 && response.status < 500;
  return isSuccess || isClientError
    ? response.json()
    : Promise.reject(response.status);
};

/**
 * Each of the functions below will send a fetch request (just like you'd do in the browser)
 * to your server based on the command structure defined in the main(). You should be able to
 * use something like these own functions.
 */

const createTask = (address, description) => {
  return fetch(`${address}/task`, {
    method: "POST",
    body: JSON.stringify({ description }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleResponse)
    .then((task) => {
      console.log({ task });
    })
    .catch((err) => {
      console.log(err);
    });
};

const completeTask = (address, id) => {
  return fetch(`${address}/task`, {
    method: "PUT",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleResponse)
    .then((body) => {
      console.log(body);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getTasks = (url) => {
  return fetch(url)
    .then(handleResponse)
    .then((body) => {
      console.log(JSON.stringify(body));
    })
    .catch((err) => {
      console.log(err);
    });
};

const getTask = (address, id) => {
  return getTasks(`${address}/task?id=${id}`);
};

const getAllTasks = (address) => {
  return getTasks(`${address}/tasks`);
};

const getCompletedTasks = (address) => {
  return getTasks(`${address}/tasks/complete`);
};

const getIncompleteTasks = (address) => {
  return getTasks(`${address}/tasks/incomplete`);
};

const main = () => {
  const configurationFilePath = path.join(__dirname, "../", "config.json");
  return fs
    .readFile(configurationFilePath, "utf-8")
    .then((configRawContents) => {
      const config = JSON.parse(configRawContents);
      const port = config.port || 8080;
      const address = `http://localhost:${port}`;

      commander.program
        .command("tasks")
        .option("--complete", "Only list completed tasks")
        .option("--incomplete", "Only list incomplete tasks")
        .action((options) => {
          if (options.complete && options.incomplete) {
            console.log("Either specify --complete or --incomplete or neither");
            process.exit(1);
          }

          if (options.complete) {
            return getCompletedTasks(address);
          } else if (options.incomplete) {
            return getIncompleteTasks(address);
          }

          return getAllTasks(address);
        });

      commander.program.command("task <id>").action((id) => {
        getTask(address, id);
      });

      commander.program.command("update <id>").action((id) => {
        completeTask(address, id);
      });

      commander.program
        .command("create <description...>")
        .action((description) => {
          createTask(address, description.join(" "));
        });

      commander.program.parse(process.argv);
    })
    .catch((err) => {
      console.log("Uncaught Error", { err });
      process.exit(1);
    });
};

main();
