const sendResponse = require("./utils/send-response");

const getAllEntries = (req, res) => {
    return req.app.db.getEnthusiasts().then((entries) => {
        sendResponse(res, 200, { entries });
    });
};

module.exports = getAllEntries;