// To access the Close button element
let closebtn = document.getElementById("closebtn");

// To acces the popup element
let popup = document.querySelector(".popup");

document.addEventListener("DOMContentLoaded", (event) => {
    popup.style.display = "block";
    document.body.style.backgroundColor = "#9EA9B1";
});



// To close the popup on click
closebtn.addEventListener("click", () => {
    popup.style.display = "none";
    document.body.style.backgroundColor = "white";
    fetch('scores.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            genererClassement(data)

        })
        .catch((error) => {
            console.error('Erreur lors de la lecture du fichier JSON :', error);
        });
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
            affichage.innerText = `${element.pseudo} : ${element.score}`;
            tableau.appendChild(affichage)
        });
    }
    else
    {
        for(let i = 0; i < 50; i++)
            {
                let affichage = document.createElement("tr");
                affichage.innerText = `${data[i].pseudo} : ${data[i].score}`;
                tableau.appendChild(affichage)
            }
    }


}