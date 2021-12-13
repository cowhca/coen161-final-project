rubric = [3, 3, 1, 3, 3];

questions = document.getElementsByClassName("question");
options = document.getElementsByClassName("option");

for (option of options) {
    option.addEventListener("click", (event) => {
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
    grade(answers);
});

function grade(answers) {
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
        score: count,
        maxScore: questions.length,
    };

    fetch("./quiz/quiz2", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
        })
        .then((response) => response.json())
        .then((data) => console.log(data));

    window.location.href = ".";
}
