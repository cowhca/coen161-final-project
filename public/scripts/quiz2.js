rubric = [3, 2, 1];

console.log("hey");

options = document.getElementsByClassName("option");

for (option of options) {
    option.addEventListener("click", (event) => {
        // event.currentTarget.classList.toggle("clicked");

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
    // For each question find which option has the clicked class
    // Call grade function with the selected answers as parameter
    // Display the result in some way
});

function grade(answers) {}