// To access the Close button element
let closebtn = document.getElementById("closebtn");

// To acces the popup element
let popup = document.querySelector(".popup");
let scoreUser = 0

document.addEventListener("DOMContentLoaded", (event) => {
    popup.style.display = "block";
    document.body.style.backgroundColor = "#9EA9B1";
    //let scoreUser = localStorage.score;
    scoreUser = 200;
});



// To close the popup on click
closebtn.addEventListener("click", () => {
    let pseudo = document.querySelector("#pseudo")
    if (pseudo.value == "")
    {
        let affichageErreurs = document.querySelector("#erreurs");
        affichageErreurs.innerText = "Vous êtes obligez de mettre un nom";
    }
    else
    {
        let pseudoValider = pseudo.value
        fetch("http://localhost/aweb/jeu-esquive/backend/api.php", {
            method: "POST",
            body: JSON.stringify({
                username: pseudo.value,  // Corrigé ici
                score: scoreUser         // Corrigé ici
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((error) => console.error("Erreur lors de la requête :", error));
        popup.style.display = "none";
        document.body.style.backgroundColor = "white";
        fetch('http://localhost/aweb/jeu-esquive/backend/api.php')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! statut : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data)
                genererClassement(data)
    
            })
            .catch((error) => {
                console.error('Erreur lors de la lecture du fichier JSON :', error);
            });
    }

});  




function genererClassement(data) 
{

    data.sort((a, b) => b.score - a.score)
    let tableau = document.querySelector("table");
    let titre = document.createElement("tr")
    titre.innerText = "Score :"
    tableau.appendChild(titre)
    if (data.length < 50)
    {
        data.forEach(element => {
            let affichage = document.createElement("tr");
            affichage.innerText = `${element.username} : ${element.score}`;
            tableau.appendChild(affichage)
        });
    }
    else
    {
        for(let i = 0; i < 50; i++)
            {
                let affichage = document.createElement("tr");
                affichage.innerText = `${data[i].username} : ${data[i].score}`;
                tableau.appendChild(affichage)
            }
    }


}