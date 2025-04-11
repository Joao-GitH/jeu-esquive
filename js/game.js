import { AnimationStorage } from "./Storage/animationsStorage.js";
import { Player, Fireball, Entity } from "./Entities/entities.js";
import { PhysicsWorld, RectangleCollider as Rect, Vector } from "./PhysicsEngine/PhysicsEngine.js";

const world = new PhysicsWorld(document.createElement("canvas").getContext("2d"));
const player = new Player(document.querySelector("#joueur"), new Rect(0,0, 60, 63), {x: 70, y: 68});
/** @type {Entity[]} */
const entities = [player];
world.addColliders(player.collider);

/** @type {HTMLParagraphElement} */
let score = document.querySelector("#score");
score.style.color = "white";
score.textContent = "0";

let intervalScore = setInterval(() => {
    score.textContent = Number(score.textContent) + 1;
}, 1000);

score.style.position = "absolute";
score.style.left = screen.width / 2 + "px";
score.style.top = "10px";

let imgFlash = document.createElement("img")
let imgShield = document.createElement("img")
let imgGhost = document.createElement("img")

imgFlash.setAttribute("src", "img/spell/flash.jpg")
imgFlash.style.height = "10vh"
imgFlash.style.width = "5vw"

imgShield.setAttribute("src", "img/spell/barriere.jpg")
imgShield.style.height = "10vh"
imgShield.style.width = "5vw"

imgGhost.setAttribute("src", "img/spell/ghost.jpg")
imgGhost.style.height = "10vh"
imgGhost.style.width = "5vw"

// Positionner les icônes de sorts en bas de l'écran
imgFlash.style.position = "fixed";
imgShield.style.position = "fixed";
imgGhost.style.position = "fixed";

// Définir les positions (ex : en bas à gauche, alignées horizontalement)
imgFlash.style.bottom = "10px";
imgFlash.style.left = "10px";

imgShield.style.bottom = "10px";
imgShield.style.left = "calc(10px + 5vw + 10px)"; // position après imgFlash

imgGhost.style.bottom = "10px";
imgGhost.style.left = "calc(10px + 5vw + 10px + 5vw + 10px)"; // position après imgShield


let mainContainer = document.querySelector("body")
mainContainer.appendChild(imgFlash)
mainContainer.appendChild(imgShield)
mainContainer.appendChild(imgGhost)

let underghost = false;
let underShield = false;
let cdShield = 0;
let cdFlash = 0;
let cdGhost = 0;

let mouseDown = false;
addEventListener("mouseup", () => mouseDown = false);
addEventListener("mousedown", (e) => {
    mouseDown = true;
    setPlayerTarget(e);
});
addEventListener("contextmenu", e => e.preventDefault());
window.addEventListener("mousemove", setPlayerTarget);

function setPlayerTarget(e) {
    if (mouseDown) {
        player.target.x = e.clientX;
        player.target.y = e.clientY;
    }
}

let start = Date.now();
let hasStartedSpawning = false;
setInterval(() => {
    main(Date.now() - start);
}, 1000 / 60);

player.collider.collide.add(() => {
    if (!underShield) {
        localStorage.score = score.textContent;
        location.href = "./gameOver.html";
    }
});

function main(timepassed) {
    world.update();
    player.setVelocityToTarget();
    player.updateAnimation();
    for (const entity of entities) {
        entity.draw();
    }

    if (!hasStartedSpawning && timepassed >= 2000) {
        hasStartedSpawning = true;
        spawnLoop();
    }
}

function getDifficulty() {
    let currentScore = Number(score.textContent);
    return 1 + currentScore / 5;
}

function spawnLoop() {
    GenererBoule(GenererPosition());
    let interval = Math.max(300, 1000 / getDifficulty());
    setTimeout(spawnLoop, interval);
}

function GenererBoule(p) {
    let boule = document.createElement("img");
    boule.classList.add("boule");
    let body = document.querySelector("body");
    body.append(boule);

    let fireball = new Fireball(boule, new Rect(p[1], p[0], 40, 40), {x: 117, y: 129});
    world.addColliders(fireball.collider);
    entities.push(fireball);
    GenererDirection(fireball);
}

function GenererPosition() {
    let choixPosition = Math.floor(Math.random() * 2);
    if (choixPosition === 1) {
        let positionX = Math.floor(Math.random() * screen.width);
        if (positionX > screen.width - 150) {
            let positionY = Math.floor(Math.random() * screen.height);
            return [positionX, positionY];
        }
        let choixPositionY = Math.floor(Math.random() * 2);
        let positionY = choixPositionY === 1 ? screen.height : 1;
        return [positionX, positionY];
    } else {
        let positionY = Math.floor(Math.random() * screen.height);
        let choixPositionX = Math.floor(Math.random() * 2);
        let positionX = choixPositionX === 1 ? screen.width : 1;
        return [positionX, positionY];
    }
}

function GenererDirection(p) {
    p.target.x = player.collider.center.x;
    p.target.y = player.collider.center.y;
    p.setVelocityToTarget();
    p.element.style.transform = `rotate(${trouverAngle(p, player)}deg)`;
}

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
            let timeoutCd = setTimeout((e) => {
                cdFlash = 0;
                imgFlash.setAttribute("src", "img/spell/flash.jpg")
            }, cdFlash)
        }


    }
    if (e.key === "e") {
        if (underghost == false) {
            imgGhost.setAttribute("src", "img/spell/ghostUsed.jpg")
            underghost = true
            cdGhost = 15000;
            player.speed = 10;
            let count = 0;
            let isBlue = false; // Permet d'alterner entre bleu clair et bleu foncé

            const interval = setInterval(() => {
                player.element.style.backgroundColor = isBlue ? "blue" : "lightblue";
                isBlue = !isBlue; // Alterne entre bleu et bleu clair

                count++;
                if (count >= 30) { // 30 cycles = 15 secondes (1 cycle = 500ms)
                    clearInterval(interval);
                    player.speed = 5; // Réinitialisation de la vitesse
                    let timeoutCd = setTimeout((e) => {
                        underghost = false
                        imgGhost.setAttribute("src", "img/spell/ghost.jpg")
                    }, cdGhost)
                }
            }, 500); // Alterne toutes les 500ms pour 1s complète entre bleu et bleu clair
        }

    }
    if (e.key === "d") {
        if (cdShield == 0) {
            imgShield.setAttribute("src", "img/spell/barriereUsed.jpg")
            underShield = true;
            cdShield = 15000
            player.element.style.border = "solid grey 3px"
            let timeout = setTimeout((e) => {
                player.element.style.border = "none"
                underShield = false;
                
            }, 3000)
            let timeoutCd = setTimeout((e) => {
                imgShield.setAttribute("src", "img/spell/barriere.jpg")
                cdShield = 0;
            }, cdShield)
        }

    }

})

function trouverAngle(el1, el2) {
    const deltaX = el1.collider.x - el2.collider.x;
    const deltaY = el2.collider.y - el1.collider.y;
    const angleBrute = Math.atan2(deltaX, deltaY);
    return angleBrute * (180 / Math.PI);
}
