import { API } from "./api.js";

API.selectAllUsers().then((r) => {
    r.sort((a, b) => b.score - a.score)
    for (let i = 0; i < r.length; i++) {
        const user = r[i];
        createUserEntry(user, i);
    }
})

/**
 * Description placeholder
 *
 * @param {{username:string, score:number}} user 
 * @param {number} index 
 */
function createUserEntry(user, index){
    const div = document.createElement("div");
    div.innerHTML = `<p>${index + 1}.</p>`
    const p = document.createElement("p");
    p.textContent = `${user.username} : ${user.score}`;
    div.append(p);
    document.querySelector("#leaderboard").append(div);
}