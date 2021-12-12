const sendResponse = require("./utils/send-response");
const fs = require("fs/promises");

const getWOE = (req, res) => {
    console.log("GETWOE");
    return fs
        .readFile("./public/wallOfEnthusiast.html")
        .then((data) => {
            sendResponse(res, 200, data, false);
        })
        .catch((err) => {
            sendResponse(res, 500);
        });
};

module.exports = getWOE;