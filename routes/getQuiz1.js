const sendResponse = require("./utils/send-response");
const fs = require("fs/promises");

const getQuiz1 = (req, res) => {
    console.log("GETQUIZ1");
    return fs
        .readFile("./public/quiz1.html")
        .then((data) => {
            sendResponse(res, 200, data, false);
        })
        .catch((err) => {
            sendResponse(res, 500);
        });
};

module.exports = getQuiz1;