import { AnimationStorage } from "./Storage/animationsStorage.js";
import { Player, Fireball } from "./Entities/entities.js";
import { RectangleCollider as Rect, RectangleCollider } from "./PhysicsEngine/PhysicsEngine.js";


const player = new Player(document.querySelector("#joueur"), new Rect(0,0, 60, 63), {x: 70, y: 68});

let score = document.querySelector("#score")
score.textContent = "0"
let intervalScore = setInterval(() => {
    score.textContent = Number(score.textContent) + Number(1);
}, 1000)
score.style.position = "absolute"
score.style.left = screen.width / 2 + "px";
score.style.top = "10px"

let underghost = false;
let underShield = false;
let cdShield = 0;
let cdFlash = 0;
let cdGhost = 0;

let mouseDown = false;
addEventListener("mouseup", () => mouseDown = false)
addEventListener("mousedown", (e) => {
    mouseDown = true
    movePlayer(e);
})
addEventListener("contextmenu", e => e.preventDefault())
window.addEventListener("mousemove", movePlayer);
function movePlayer(e) {
    if (mouseDown) {
        player.target.x = e.clientX
        player.target.y = e.clientY
        player.collider.velocity.x = player.target.x - player.center.x;
        player.collider.velocity.y = player.target.y - player.center.y;
        player.normalize();
        player.collider.velocity.x *= player.speed;
        player.collider.velocity.y *= player.speed;
    }
}

function move() {
    if (!(player.target.x >= player.center.x && player.target.x <= player.width - player.center.x
        && player.target.y >= player.center.y && player.target.y <= player.height - player.center.y)) {
        player.x += player.collider.velocity.x;
        player.y += player.collider.velocity.y;
        player.collider.velocity.x = player.target.x - player.center.x;
        player.collider.velocity.y = player.target.y - player.center.y;
        player.normalize();
        player.collider.velocity.x *= player.speed;
        player.collider.velocity.y *= player.speed;
    }
    else
        player.collider.velocity = { x: 0, y: 0 };
    player.updateAnimation();
    requestAnimationFrame(move);
}
move();
 
setInterval(() => {
    Main()
}, 500)

// Fonction principale qui démarre la génération des boules
function Main() {
    return  new Promise((resolve) => {
        if (score.textContent == 180) {
            setTimeout(() => {
                GenererBoule(GenererPosition()) // Génère une boule toutes les secondes
                resolve()
            }, 1)
        }
        else{
            setTimeout(() => {
                GenererBoule(GenererPosition()) // Génère une boule toutes les secondes
                resolve()
            }, 1000 - Number(score.textContent) * 100)
        }
    });
}

// Fonction pour générer une boule à une position donnée
function GenererBoule(p) {
    let boule = document.createElement("img") // Création d'un élément div
    boule.classList.add("boule") // Ajout d'une classe CSS pour le style
    let body = document.querySelector("body") // Sélection du corps de la page
    body.append(boule) // Ajout de la boule au body

    // Définition des styles de la boule
    boule.style.top = `${p[1]}px` // Position verticale aléatoire
    boule.style.left = `${p[0]}px` // Position horizontale aléatoire
    let fireball = new Fireball(boule, new Rect(0,0,75,42), {x: 112, y: 129 })
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

    p.target.x = player.x + player.width / 2
    p.target.y = player.y + player.height / 2
    p.collider.velocity.x = p.target.x - p.x;
    p.collider.velocity.y = p.target.y - p.y;
    p.normalize();
    p.collider.velocity.x *= p.speed;
    p.collider.velocity.y *= p.speed;
    p.element.style.transform = `rotate(${trouverAngle(p, player)}deg)`;
    setInterval(() => {
        movefireball(p)
    }, 1000 / 60); // Rafraîchissement rapide pour un mouvement fluide
}
/** @param {Fireball} p  */
function movefireball(p) {
    p.x += p.collider.velocity.x;
    p.y += p.collider.velocity.y;
    if (p.x < 0 || p.x > screen.width) {
        p.element.remove()
        return
    }
    if (p.y < 0 || p.y > screen.height) {
        p.element.remove()
        return
    }

    // Assuming player has width and height properties (for example, player.width and player.height)
    if (
        p.center.x < player.x + player.offset.x + player.center.x + player.width &&
        p.center.x + p.offset.x > player.x + player.offset.x + player.center.x &&
        p.center.y < player.y + player.offset.y + player.center.y + player.height &&
        p.center.y + p.offset.x > player.y + player.offset.y + player.center.y
    ) {
        p.element.remove();  // Remove the fireball element

        // Check if the player is under shield
        if (underShield === false) {
            clearInterval(intervalScore);  // Stop the score interval
            localStorage.score = score.textContent;  // Save the score to localStorage
            // Uncomment this line if you want to redirect the player to the Game Over screen
            // window.location.href = 'gameOver.html';
        }
    }

}

let posSourisXSpell = 0;
let posSourisYSpell = 0;

document.addEventListener('mousemove', function (event) {
    posSourisXSpell = event.clientX
    posSourisYSpell = event.clientY

});

window.addEventListener("keypress", (e) => {
    console.log(e.key);
    let posSourisX = posSourisXSpell
    let posSourisY = posSourisYSpell
    if (e.key == "f") {

        if (cdFlash == 0) {
            cdFlash = 15000;
            player.x = posSourisX + ((player.x - posSourisX) / 1.35);
            player.y = posSourisY + ((player.y - posSourisY) / 1.35);
            player.target.x = player.x;
            player.target.y = player.y;
            let timeoutCd = setTimeout((e) => {
                cdFlash = 0;
            }, cdFlash)
        }


    }
    if (e.key === "e") {
        if (underghost == false) {
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
                    }, cdGhost)
                }
            }, 500); // Alterne toutes les 500ms pour 1s complète entre bleu et bleu clair
        }

    }
    if (e.key === "d") {
        if (cdShield == 0) {
            underShield = true;
            cdShield = 15000
            player.element.style.border = "solid grey 3px"
            let timeout = setTimeout((e) => {
                player.element.style.border = "none"
                underShield = false;
            }, 3000)
            let timeoutCd = setTimeout((e) => {
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
    const deltaX = el1.x - el2.x
    const deltaY = el2.y - el1.y
    const angleBrute = Math.atan2(deltaX, deltaY)
    const angle = angleBrute * (180 / Math.PI);
    return angle
}