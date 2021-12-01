const http = require("http");
const { MongoClient } = require("mongodb");
const readBody = require("./utils/read-body");
const sendResponse = require("./utils/send-response");

const uri =
  "mongodb+srv://admin:arman@cluster0.vj40o.mongodb.net/project?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const addUsername = (username) => {
  client.connect((err) => {
    const collection = client.db("project").collection("username");
    // perform actions on the collection object
    collection.insertOne({ x: username }, (err, res) => {
      if (err) throw err;
      console.log("1 document inserted");
      client.close();
    });
  });
};

const readUsername = () => {
  client.connect((err) => {
    const collection = client.db("project").collection("username");
    // perform actions on the collection object
    collection.findOne({ x: 3 }, (err, res) => {
      if (err) throw err;
      console.log("1 document found");
      console.log(res);
      client.close();
      return res;
    });
  });
};

const handleRequest = () => {
  return (req, res) => {
    if (req.method === "POST") {
      return readBody(req).then((body) => {
        if (body === "") sendResponse(res, 400, null);
        else {
          console.log("body " + body);
          addUsername(body);
          sendResponse(res, 201, "successfull adding");
        }
      });
    } else if (req.method === "GET") {
      if (req.url === "") {
        return sendResponse(res, 400, "Need a username");
      } else {
        return sendResponse(res, 200, readUsername());
      }
    }

    // if (req.url === "/") {
    //   if (req.method === "POST") {
    //     console.log(req.)
    //     client.connect((err) => {
    //       const collection = client.db("project").collection("username");
    //       // perform actions on the collection object
    //       collection.insertOne({ x: 3 }, (err, res) => {
    //         if (err) throw err;
    //         console.log("1 document inserted");
    //         client.close();
    //       });
    //     });
    //     res.end();
    //   }
    // }
  };
};

const port = 8080;

http.createServer(handleRequest()).listen(port);

console.log("Server running on port " + port);
