const http = require("http");

const sendResponse = function (res, code = 200, body) {
  res.statusCode = code;
  res.statusMessage = http.STATUS_CODES[code];

  console.log("body " + body);
  if (body) {
    res.write(body);
  }

  return res.end();
};

module.exports = sendResponse;
