import { API } from "./api.js";
let score = document.getElementById("btnScore")
let divScore = document.getElementById("score")
score.addEventListener("click" , (e)=>{
    API.selectAllUsers().then(result => {
        result.forEach(element => {
            let titre = document.createElement("")
        });
    })
})
