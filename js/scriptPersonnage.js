import { Entity } from "./Entities/entity.js";
import { Fireball } from "./Entities/fireball.js";
import { Player } from "./Entities/player.js";
import { PhysicsWorld } from "./PhysicsEngine/physicsWorld.js";
import { Timer } from "./utilities/timer.js";

addEventListener("mousedown", (e) => {
    mouseDown = true;
    setPlayerTarget(e);
});
addEventListener("mouseup", () => mouseDown = false);
addEventListener("contextmenu", e => e.preventDefault());

let underShield = false;
const player = new Player();
/** @type {Entity[]} */
let entities = [player];
const world = new PhysicsWorld(document.createElement("canvas").getContext("2d"));


/** @type {NodeListOf<HTMLIFrameElement>} */
const skills = document.querySelectorAll(".skill");

const imgFlash = skills[0];
const imgShield = skills[1];
const imgGhost = skills[2];

/** @type {HTMLParagraphElement} */
const score = document.querySelector("#score");

let mouseDown = false;

player.sprite.id = "joueur";
player.death.add(() => {
    if (!underShield) {
        localStorage.score = score.textContent;
        location.href = "./gameOver.html";
    }
})
world.addColliders(player.collider, player.target);
setupElements();
setInterval(() => {
    main()
}, 1000 / 60);

function main(){
	world.update();
	player.updateAnimation();
    for (const entity of entities){
        entity.draw();
    }
    filterFireballs();
}
generateFireballs();

let intervalScore = setInterval(() => {
    score.textContent = (Number(score.textContent) + 1).toString();
}, 1000);

document.addEventListener("mousemove", e => {
    if(mouseDown)
        setPlayerTarget(e);
});

function filterFireballs() {
    entities = entities.filter((e) => {
	const x = e.collider.center.x;
	const y = e.collider.center.y; // Fixed: use center.y, not collider.y
    const inside = (
		x >= -50 &&
		x <= window.innerWidth + 50 &&
		y >= -50 &&
		y <= window.innerHeight + 50
	);
    if(!inside){
        world.removeCollider(e.collider)
        e.sprite.remove();
        e.hitbox.remove()
    }
    return inside;
});

}
function getDifficulty() {
    let currentScore = Number(score.textContent);
    return 1 + currentScore / 5;
}

function setPlayerTarget(e) {
    if (mouseDown) {
        player.target.x = e.clientX;
        player.target.y = e.clientY;
    }

	player.setVelocityToTarget();
}

async function generateFireballs() {
    while(true){
        const fireball = new Fireball();
        fireball.setTargetToPlayer(player);
        world.addColliders(fireball.collider);
        entities.push(fireball);
        let interval = Math.max(300, 1000 / getDifficulty());
        await new Promise((resolve) => setTimeout(() => resolve(), interval));
    }
}

function setupElements() {

    let mainContainer = document.querySelector("body")
    mainContainer.appendChild(imgFlash)
    mainContainer.appendChild(imgShield)
    mainContainer.appendChild(imgGhost)

    let underghost = false;
    let cdShield = 0;
    let cdFlash = 0;
    let cdGhost = 0;

    window.addEventListener("keypress", (e) => {
    console.log(e.key);
    let posSourisX = player.target.x;
    let posSourisY = player.target.y;
    if (e.key == "f") {

        if (cdFlash == 0) {
            imgFlash.setAttribute("src", "img/spell/flashUsed.jpg")
            cdFlash = 15000;
            player.collider.x = posSourisX + ((player.collider.x - posSourisX) / 1.35);
            player.collider.y = posSourisY + ((player.collider.y - posSourisY) / 1.35);
            player.target.x = player.collider.x;
            player.target.y = player.collider.y;
            player.skillManager.animationManager.play("flash");
            let timeoutCd = setTimeout((e) => {
                cdFlash = 0;
                imgFlash.setAttribute("src", "img/spell/flash.jpg")
            }, cdFlash)
        }


    }
    if (e.key === "e") {
        if (underghost == false) {
            imgGhost.src = "img/spell/ghostUsed.jpg";
            underghost = true
            cdGhost = 15000;
            player.speed = 10;
            let count = 0;

            const interval = setInterval(() => {

                count++;
                if (count >= 30) { // 30 cycles = 15 secondes (1 cycle = 500ms)
                    clearInterval(interval);
                    player.speed = 5; // Réinitialisation de la vitesse
                    let timeoutCd = setTimeout((e) => {
                        underghost = false
                        imgGhost.src = "img/spell/ghost.jpg";
                    }, cdGhost)
                }
            }, 500); // Alterne toutes les 500ms pour 1s complète entre bleu et bleu clair
        }

    }
    if (e.key === "d") {
        if (cdShield == 0) {
            imgShield.src = "img/spell/barriereUsed.jpg";
            underShield = true;
            cdShield = 15000
            player.skillManager.animationManager.play("defend");
            let timeout = setTimeout((e) => {
                player.skillManager.animationManager.stop();
                underShield = false;
                
            }, 3000)
            let timeoutCd = setTimeout((e) => {
                imgShield.src = "img/spell/barriere.jpg";
                cdShield = 0;
            }, cdShield)
        }

    }

})

}

