const sendResponse = require("./utils/send-response");
const fs = require("fs/promises");

const getWOE = (req, res) => {
    return fs
        .readFile("./public/wallOfEnthusiast.html")
        .then((data) => {
            sendResponse(res, 200, data, false, "text/html");
        })
        .catch((err) => {
            sendResponse(res, 500);
        });
};

module.exports = getWOE;