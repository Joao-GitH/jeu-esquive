import { AnimationStorage } from "./Storage/animationsStorage.js";
import { Player, Fireball, Entity } from "./Entities/entities.js";
import { PhysicsWorld, RectangleCollider as Rect, RectangleCollider, Vector } from "./PhysicsEngine/PhysicsEngine.js";


const world = new PhysicsWorld(document.createElement("canvas").getContext("2d"));
const player = new Player(document.querySelector("#joueur"), new Rect(0,0, 60, 63), {x: 70, y: 68});
/** @type {Entity[]} */
const entities = [player];
world.addColliders(player.collider)

/** @type {HTMLParagraphElement} */
let score = document.querySelector("#score")
score.style.color = "white"
score.textContent = "0"
let intervalScore = setInterval(() => {
    score.textContent = (Number(score.textContent) + Number(1)).toString();
}, 1000)
score.style.position = "absolute"
score.style.left = screen.width / 2 + "px";
score.style.top = "10px"

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
addEventListener("mouseup", () => mouseDown = false)
addEventListener("mousedown", (e) => {
    mouseDown = true
    setPlayerTarget(e);
})
addEventListener("contextmenu", e => e.preventDefault())
window.addEventListener("mousemove", setPlayerTarget);

function setPlayerTarget(e) {
    if (mouseDown) {
        player.target.x = e.clientX
        player.target.y = e.clientY
    }
}
const start = Date.now();
setInterval(() => {
    main(Date.now() - start)
}, 1000 / 60)

// Fonction principale qui démarre la génération des boules
//player.collider.collide.add(() => {alert("a")})
function main(timepassed) {
    world.update();
    player.setVelocityToTarget();
    player.updateAnimation();
    for (const entity of entities) {
        entity.draw();
    }
    function spawnLoop() {
        GenererBoule(GenererPosition());
        let interval = Math.max(300, 1000 / getDifficulty());
        setTimeout(spawnLoop, interval);
    }
    if(timepassed % 500 < 10){
        return new Promise((resolve) => {
            if (score.textContent == (180).toString()) {
                setTimeout(() => {
                    spawnLoop();
                    resolve()
                }, 1)
            }
            else{
                setTimeout(() => {
                    spawnLoop();
                    resolve()
                }, 1000 - Number(score.textContent) * 100)
            }
        });
    }
}
// Calcule la difficulté en fonction du score
function getDifficulty() {
    let currentScore = Number(score.textContent);
    return 1 + currentScore /60 ;
}
// Fonction pour générer une boule à une position donnée
function GenererBoule(p) {
    let boule = document.createElement("img") // Création d'un élément div
    boule.classList.add("boule") // Ajout d'une classe CSS pour le style
    let body = document.querySelector("body") // Sélection du corps de la page
    body.append(boule) // Ajout de la boule au body

    // Définition des styles de la boule
    let fireball = new Fireball(boule, new Rect(p[1],p[0],40,40), {x: 117, y: 129 })
    world.addColliders(fireball.collider);
    entities.push(fireball);
    GenererDirection(fireball) // Démarre le mouvement de la boule
}

// Fonction pour générer une position aléatoire sur les bords de l'écran
function GenererPosition() {
    let choixPosition = Math.floor(Math.random() * 2) // Choisir entre X ou Y comme point de départ
    if (choixPosition == 1) {
        let positionX = Math.floor(Math.random() * screen.width)
        if (positionX > screen.width - 150) {
            let positionY = Math.floor(Math.random() * screen.height)
            return [positionX, positionY]
        }
        let choixPositionY = Math.floor(Math.random() * 2)
        if (choixPositionY == 1) {
            let positionY = screen.height
            return [positionX, positionY]
        } else {
            let positionY = 1
            return [positionX, positionY]
        }
    } else {
        let positionY = Math.floor(Math.random() * screen.height)
        let choixPositionX = Math.floor(Math.random() * 2)
        if (positionY > screen.height - 50) {
            let positionX = Math.floor(Math.random() * screen.width)
            return [positionX, positionY]
        }
        if (choixPositionX == 1) {
            let positionX = screen.width
            return [positionX, positionY]
        } else {
            let positionX = 1
            return [positionX, positionY]
        }
    }
}

// 
/**
 * Fonction qui génère une direction aléatoire et fait bouger la boule
 * @param {Fireball} p 
 */
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


/**
 * genere un angle
 * @param {Fireball} el1 
 * @param {Player} el2 
 */
function trouverAngle(el1, el2) {
    const deltaX = el1.collider.x - el2.collider.x
    const deltaY = el2.collider.y - el1.collider.y
    const angleBrute = Math.atan2(deltaX, deltaY)
    const angle = angleBrute * (180 / Math.PI);
    return angle
}