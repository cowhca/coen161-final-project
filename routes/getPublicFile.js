const sendResponse = require("./utils/send-response");
const fs = require("fs/promises");

const getPublicFile = (req, res) => {
    let type = "text/html";
    if (req.url.includes("styles")) {
        type = "text/css";
    } else if (req.url.includes("scripts")) {
        type = "text/javascript";
    }
    return fs
        .readFile("./" + req.url.match("public.*")[0])
        .then((data) => {
            sendResponse(res, 200, data, type);
        })
        .catch((err) => {
            sendResponse(res, 500);
        });
};

module.exports = getPublicFile;