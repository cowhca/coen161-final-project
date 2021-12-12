const http = require("http");
const sendResponse = require("./utils/send-response");
const pathToRegexp = require("path-to-regexp");

// I like to create a bunch of really small files for each function so I only focus on the
// function at hand. If the files get too big, I get lost in them.
const createEntry = require("./createEntry");
const getAllEntries = require("./getAllEntries");
const getUserEntries = require("./getUserEntries");

/**
 * @function routeRequest
 * @description Given a request object from Node.js, returns
 *              an object of the methods possible at a given path. Also assigns the
 *              req.params object to any parameters in the request.
 *              For parsing parameters in a URL, it should use
 *              the path-to-regexp library - https://github.com/pillarjs/path-to-regexp
 * @param {http.ClientRequest} req - The http.ClientRequest to route
 * @returns {function(http.ClientRequest, httpClientResponse)} a request handler
 */
const routeRequest = (req) => {
    // routing table
    const routes = {
        "/quiz/:quiz": {
            POST: createEntry,
        },
        "/entries": {
            GET: getAllEntries,
        },
        "/user/:user": {
            GET: getUserEntries,
        },
        "/coen-161/final/quizzes/quiz/:quiz": {
            POST: createEntry,
        },
        "/coen-161/final/quizzes/entries": {
            GET: getAllEntries,
        },
        "/coen-161/final/quizzes/user/:user": {
            GET: getUserEntries,
        },
        "/coen-161/final/quizzes/": {
            // We need a get end point for each of the pages I think
            // the function needs to respond with the html
            // we also need a way to get the css files
        },
    };

    let matcher;
    let longestMatchLength = 0;
    let longestRoute;

    for (route in routes) {
        matcher = pathToRegexp.match(route);
        let params = matcher(req.url);
        if (params) {
            let path = params.path;
            if (path.split("/").length > longestMatchLength) {
                // setting the longest path, this is needed for the public endpoint
                longestMatchLength = path.split("/").length;
                longestMatch = params;
                longestRoute = route;
            }
        }
    }

    // If there was a match then attach data to the request object and return
    if (longestMatchLength > 0) {
        req.pathname = "/" + longestMatch.path.split("/").slice(2).join("/");
        req.params = longestMatch.params;
        return routes[longestRoute];
    } else {
        return null;
    }
};

/**
 * @function handleRequests
 * @description a higher order function meant to
 *
 * @param {EntriesCollection} db - a mongodb client connected to a "entries" collection
 * @returns {http.RequestListener} a function that can handle requests
 */
const handleRequests = (db) => {
    // return a function that fulfills that can be used as the  http.createServer()
    // callback function to http.createServer
    return (req, res) => {
        let handlersForURL = routeRequest(req);

        // if we can't match the URL, then send back a 404
        if (!handlersForURL) {
            return sendResponse(res, 404, {
                error: `Could not find a handler for url ${req.url}`,
            });
        }

        // if the URL matched but we can't handle the request method, send back a 405
        const handlerForRequestMethod = handlersForURL[req.method];
        console.log(req.method);
        if (!handlerForRequestMethod) {
            return sendResponse(res, 405, {
                error: `${req.method} requests are not allowed for ${req.url}`,
            });
        }

        req.app = { db };
        return handlerForRequestMethod(req, res);
    };
};

module.exports = handleRequests;