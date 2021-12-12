let quiz_counter = 1;
let quiz_counter_next = 2;

change = document.getElementById("next1");
change.addEventListener("click", (event) => {
  if (quiz_counter === 1) {
    console.log(quiz_counter);
    document.getElementById("question" + [quiz_counter]).style.display = "none";

    document
      .getElementById("question" + [quiz_counter_next])
      .removeAttribute("id");
  }

  if (quiz_counter > 1 && quiz_counter < 5) {
    console.log(quiz_counter);
    document.getElementById(
      "question" + [quiz_counter] + "_answered"
    ).style.display = "none";
    document
      .getElementById("question" + [quiz_counter_next])
      .removeAttribute("id");
  }

  if (quiz_counter === 4) {
    document.getElementById("next").style.display = "none";
    document.getElementById("hidden").removeAttribute("id");
  }

  quiz_counter++;
  quiz_counter_next++;
});
