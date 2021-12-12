const http = require("http");

const sendResponse = (res, statusCode, body = null, json = true) => {
    if (body && res.statusCode !== 500) {
        try {
            const headers = {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": json ? "application/json" : "text/html",
                ...res.headers,
            };

            const responseBody =
                headers["Content-Type"] === "application/json" ?
                JSON.stringify(body) :
                body;

            res.writeHead(statusCode, http.STATUS_CODES[statusCode], headers);
            res.write(responseBody);
        } catch (err) {
            if (err instanceof SyntaxError) {
                res.writeHead(500);
            }
        }
    } else {
        res.writeHead(statusCode);

        if (res.statusCode === 500) {
            console.log("ERROR");
        }
    }
    res.end();
    return Promise.resolve({
        statusCode,
        body,
    });
};

module.exports = sendResponse;