const fetch = require("node-fetch");

// fetch("http://localhost:8080/entries")
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// fetch("http://localhost:8080/quiz/quiz1", {
//         method: "POST",
//     })
//     .then((response) => response.json())
//     .then((data) => console.log(data));

fetch("http://localhost:8080/quiz/quiz1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "test", character: "elsa" }),
    })
    .then((response) => response.json())
    .then((data) => console.log(data));