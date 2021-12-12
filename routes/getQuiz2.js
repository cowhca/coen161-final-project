const sendResponse = require("./utils/send-response");
const fs = require("fs/promises");

const getQuiz2 = (req, res) => {
    console.log("GETQUIZ2");
    return fs
        .readFile("./public/quiz2.html")
        .then((data) => {
            sendResponse(res, 200, data, false);
        })
        .catch((err) => {
            sendResponse(res, 500);
        });
};

module.exports = getQuiz2;