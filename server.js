const path = require("path");
const fs = require("fs").promises;
const http = require("http");
const mongodb = require("mongodb");

const handleRequests = require("./routes/handleRequests");
const EntriesCollection = require("./mongodb/EntriesCollection");

const REQUIRED_CONFIGURATION = [
    "username",
    "password",
    "address",
    "defaultDatabase",
    "port",
];

/**
 * @function setupServer
 * @description Initializes all the state necessary for the server.
 * In this example, all that's necessary is to establish a connection
 * to the database.
 *
 * @param {Object} config - configuration object that hopefully contains all the server configuration
 * @returns { db: EntriesCollection, port: number }
 */
const setupServer = (config) => {
    // this section breakas up the mongoURL into its constituent parts
    const authentication = `${config.username}:${config.password}`;
    const address = `${config.address}/${config.defaultDatabase}`;
    const options = "retryWrites=true&w=majority";
    const mongoURL = `mongodb+srv://${authentication}@${address}?${options}`;

    // setup optioins for the MongoDB client. We haven't yet established
    // a connection, we're specifying HOW we want to connect.
    const client = new mongodb.MongoClient(mongoURL, {
        // I'm not sure what these options do, but these are part of
        // the default that MongoDB wants us to send. I had to comment out
        // the useNewUrlParse option from the full driver code for some random error
        // useNewUrlParse: true,
        useUnifiedTopology: true,
    });

    // Connect once per server since the MongoClient will handle all the
    // connection logic: https://stackoverflow.com/questions/10656574/how-do-i-manage-mongodb-connections-in-a-node-js-web-application
    // Because we want to return a fully connected client + the port,
    // we can't use return client.connect() which returns a Promise itself.
    // Remember this server's configuratioin isn't JUST the database connection.
    const connectionPromise = client.connect();
    return connectionPromise.then(() => {
        return {
            port: config.port,
            db: EntriesCollection(client.db(config.defaultDatabase)),
        };
    });
};

/**
 * @function catchJSONConfigFileReadingErrors
 * @description Handles any errors that might occur while reading a JSON file
 *  and exits the program with an approppriate message.
 *
 * @param {string} file - the name of the file that was attempted to be read
 * @param {Error} err - the error that was returned
 *
 * @exits
 */
const catchJSONConfigFileReadingErrors = (file, err) => {
    // this checks specifically for any Syntax error. when JSON.parse fails
    // to prse JSON, it returns SyntaxaError
    if (err instanceof SyntaxError) {
        console.log(
            "file contents could not be decoded as JSON, verify the JSON is proper using a JSON linter"
        );
    } else if (err.code === "ENOENT") {
        console.log(`${file} was not found`);
    } else if (err.code === "EISDIR") {
        console.log(`${file} is a directory but a file was expected`);
    } else {
        console.log(err);
    }

    process.exit(1);
};

/**
 * @function createServer
 * @description creates an HTTP server on the given port and passes the initial state
 * to every request listener
 *
 * @param {{ db: EntriesCollection, port: number }} initializedServerState
 */
const createServer = (initializedServerState) => {
    const server = http.createServer(handleRequests(initializedServerState.db));
    server.listen(initializedServerState.port);
    console.log(
        `PID: ${process.pid}. Running on :${initializedServerState.port}`
    );
};

/**
 * @function main
 * @description the starting point for this program
 */
const main = () => {
    // __dirname in a node script returns the path of the folder where the current JavaScript file resides
    // so we can use path relative to this server.js file
    const mainDirectory = __dirname;

    // read configuration parameters from the config;.json file so
    // we can change configuration without changing our code
    const configurationFilePath = path.join(mainDirectory, "config.json");
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
                    `Configuration is invalid. Missing the following keys: ${missingKeys}`
                );
                process.exit(1);
            }

            return setupServer(config);
        })
        .catch((err) => {
            catchJSONConfigFileReadingErrors(configurationFilePath, err);
        })
        .then(createServer);
};

main();