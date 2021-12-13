const sendResponse = require("./utils/send-response");

const getUserEntries = (req, res) => {
    return req.app.db.getUserEntries(req.params.user).then((entries) => {
        sendResponse(res, 200, { entries }, "application/json");
    });
};

module.exports = getUserEntries;