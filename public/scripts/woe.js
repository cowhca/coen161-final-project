const parent = document.getElementById("enthusiasts");

fetch("./enthusiasts")
    .then((response) => response.json())
    .then((data) => {
        let enthusiasts = data.entries.entries;
        for (e of enthusiasts) {
            let entry = document.createElement("section");
            entry.innerText = "Username: " + e.username + "\nQuiz: " + e.quiz;
            entry.classList.add("enthusiast");
            parent.appendChild(entry);
        }
    });