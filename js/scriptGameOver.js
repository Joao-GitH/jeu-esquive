// To access the Close button element
let closebtn = document.getElementById("closebtn");

// To acces the popup element
let popup = document.querySelector(".popup");
let scoreUser = Number(localStorage.score);
let main = document.querySelector("main")

document.addEventListener("DOMContentLoaded", (event) => {
    popup.style.display = "block";
    document.body.style.backgroundColor = "#9EA9B1";
});

let affichageScore = document.querySelector("#affichageScore")
affichageScore.textContent = localStorage.score

// To close the popup on click
closebtn.addEventListener("click", () => {
    console.log("cliqué");
    let pseudo = document.querySelector("#pseudo");
    
    if (pseudo.value == "") {
        let affichageErreurs = document.querySelector("#erreurs");
        affichageErreurs.innerText = "Vous êtes obligé de mettre un nom";
    } else {
        let pseudoValider = pseudo.value;
        fetch("./backend/api.php", {
            method: "POST",
            body: JSON.stringify({
                username: pseudoValider,  // Corrected here
                score: scoreUser          // Corrected here
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((reponse) => {
            // Check if the response is ok (status code 200)
            if (!reponse.ok) {
                throw new Error(`HTTP error! Status: ${reponse.status}`);
            }
            return reponse.text();  // Get the response as text first
        })
        .then((responseText) => {
            console.log("Response Text:", responseText); // Log the raw response text
            try {
                // Attempt to parse the response as JSON
                const jsonResponse = JSON.parse(responseText);
                window.location.href = 'index.html';
            } catch (error) {
                // Handle any errors that occur during JSON parsing
                console.error("Failed to parse JSON:", error);
            }
        })
        .catch((error) => {
            // Catch any errors in the fetch process
            console.error("Fetch error:", error);
        });
    }
});


function genererClassement(data) {

    data.sort((a, b) => b.score - a.score)
    let tableau = document.querySelector("table");
    let titre = document.createElement("tr")
    titre.innerText = "Score :"
    tableau.appendChild(titre)
    if (data.length < 50) {
        data.forEach(element => {
            let affichage = document.createElement("tr");
            affichage.innerText = `${element.username} : ${element.score}`;
            tableau.appendChild(affichage)
        });
    }
    else {
        for (let i = 0; i < 50; i++) {
            let affichage = document.createElement("tr");
            affichage.innerText = `${data[i].username} : ${data[i].score}`;
            tableau.appendChild(affichage)
        }
    }


}