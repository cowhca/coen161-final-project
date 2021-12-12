rubric = [0, 1, 0];

console.log("hey");

questions = document.getElementsByClassName("question");
options = document.getElementsByClassName("option");

for (option of options) {
    option.addEventListener("click", (event) => {
        console.log("heyo");
        allOptions = event.currentTarget.parentElement.children;

        for (o of allOptions) {
            o.classList.remove("clicked");
        }
        event.currentTarget.classList.add("clicked");
    });
}

submit = document.getElementById("submit");

submit.addEventListener("click", (event) => {
    answers = [];
    // Get all the questions
    questionOptions = document.getElementsByClassName("options");
    for (q of questionOptions) {
        options = q.children;
        i = 0;
        for (o of options) {
            if (o.classList.contains("clicked")) {
                break;
            }
            ++i;
        }
        answers.push(i);
    }
    console.log(answers);
    grade(answers);
});

function grade(answers) {
    console.log(JSON.stringify(rubric));
    count = 0;
    for (let i = 0; i < rubric.length; ++i) {
        if (answers[i] === rubric[i]) {
            ++count;
        }
    }
    let un = window.prompt("What is your username?");
    window.alert("You got " + count + " out of " + questions.length + " right.");
    result = {
        username: un,
        character: "elsa",
        score: count,
        maxscore: questions.length,
    };

    // fetch("http://localhost:8080/user/connor")
    //     .then((response) => response.json())
    //     .then((data) => console.log(data));

    fetch("http://localhost:8080/quiz/quiz1", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
            origin: "test",
        })
        .then((response) => response.json())
        .then((data) => console.log(data));

    // fetch("http://localhost:8080/quiz/quiz1", {
    //         mode: "no-cors",
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ username: "test", character: "elsa" }),
    //     })
    //     .then((response) => response.json())
    //     .then((data) => console.log(data));

    // fetch("localhost:8080/entries");
    // fetch("localhost:8080/quiz/quiz1", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json;charset=utf-8",
    //     },
    //     body: JSON.stringify(result),
    // });
    //
}