const readBody = require("./utils/read-body");
const sendResponse = require("./utils/send-response");

const createEntry = (req, res) => {
    return readBody(req).then((body) => {
        const options = JSON.parse(body);
        if (!options.username || !options.character) {
            return sendResponse(res, 400, {
                error: "username and character are required fields",
            });
        }

        return req.app.db
            .createEntry(options.username, req.params.quiz, options.character)
            .then((entry) => {
                sendResponse(res, 201, { entry });
            });
    });
};

module.exports = createEntry;