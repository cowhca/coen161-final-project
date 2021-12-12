const sendResponse = require("./utils/send-response");
const fs = require("fs/promises");

const getPublicFile = (req, res) => {
    console.log("GETPUBLICFILE");
    console.log("Request pathname: " + req.pathname.match("public.*")[0]);
    return fs
        .readFile("./" + req.pathname.match("public.*")[0])
        .then((data) => {
            console.log("THEN");
            sendResponse(res, 200, data, false);
        })
        .catch((err) => {
            console.log("CATCH");
            sendResponse(res, 500);
        });
};

module.exports = getPublicFile;