const sendResponse = require("./utils/send-response");
const fs = require("fs/promises");

const getPublicFile = (req, res) => {
    return fs
        .readFile("./" + req.pathname.match("public.*")[0])
        .then((data) => {
            sendResponse(res, 200, data, false);
        })
        .catch((err) => {
            sendResponse(res, 500);
        });
};

module.exports = getPublicFile;