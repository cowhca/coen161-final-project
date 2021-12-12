const sendResponse = require("./utils/send-response");
const fs = require("fs/promises");

const getHomePage = (req, res) => {
    return fs
        .readFile("./public/home.html")
        .then((data) => {
            sendResponse(res, 200, data, false);
        })
        .catch((err) => {
            sendResponse(res, 500);
        });
};

module.exports = getHomePage;