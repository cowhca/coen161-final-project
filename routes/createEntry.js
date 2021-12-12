const readBody = require("./utils/read-body");
const sendResponse = require("./utils/send-response");

const createEntry = (req, res) => {
    return readBody(req).then((body) => {
        const options = JSON.parse(body);
        if (
            options.username === undefined ||
            req.params.quiz === undefined ||
            options.score === undefined ||
            options.maxScore === undefined
        ) {
            return sendResponse(res, 400, {
                error: "username, quiz, score, and maxScore are required fields",
            });
        }

        return req.app.db
            .createEntry(
                options.username,
                req.params.quiz,
                options.score,
                options.maxScore
            )
            .then((entry) => {
                sendResponse(res, 201, { entry });
            });
    });
};

module.exports = createEntry;