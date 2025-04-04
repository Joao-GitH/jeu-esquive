import { AnimationStorage } from "./Storage/animationsStorage.js";
import { Player, Fireball } from "./Entities/entities.js";

const player = new Player(document.querySelector("#joueur"), { width: 60, height: 63, offsetX: 70, offsetY: 68 });

let score = document.querySelector("#score");
score.textContent = "0";
score.style.position = "absolute";
score.style.left = screen.width / 2 + "px";
score.style.top = "10px";

let intervalScore = setInterval(() => {
    score.textContent = Number(score.textContent) + 1;
}, 1000);

let underghost = false;
let underShield = false;
let cdShield = 0;
let cdFlash = 0;
let cdGhost = 0;

let mouseDown = false;
addEventListener("mouseup", () => mouseDown = false);
addEventListener("mousedown", (e) => {
    mouseDown = true;
    movePlayer(e);
});
addEventListener("contextmenu", e => e.preventDefault());
window.addEventListener("mousemove", movePlayer);

function movePlayer(e) {
    if (mouseDown) {
        player.target.x = e.clientX;
        player.target.y = e.clientY;
        player.vector.x = player.target.x - player.center.x;
        player.vector.y = player.target.y - player.center.y;
        player.normalize();
        player.vector.x *= player.speed;
        player.vector.y *= player.speed;
    }
}

function move() {
    if (!(player.target.x >= player.center.x && player.target.x <= player.width - player.center.x
        && player.target.y >= player.center.y && player.target.y <= player.height - player.center.y)) {
        player.x += player.vector.x;
        player.y += player.vector.y;
        player.vector.x = player.target.x - player.center.x;
        player.vector.y = player.target.y - player.center.y;
        player.normalize();
        player.vector.x *= player.speed;
        player.vector.y *= player.speed;
    } else {
        player.vector = { x: 0, y: 0 };
    }
    player.updateAnimation();
    requestAnimationFrame(move);
}
move();

// Fonction principale qui démarre la génération des boules
function Main() {
    function spawnLoop() {
        GenererBoule(GenererPosition());
        let interval = Math.max(300, 1000 / getDifficulty());
        setTimeout(spawnLoop, interval);
    }
    spawnLoop();
}
Main();

// Fonction pour générer une position aléatoire sur les bords de l'écran
function GenererPosition() {
    let choixPosition = Math.floor(Math.random() * 2);
    if (choixPosition == 1) {
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
        if (positionY > screen.height - 50) {
            let positionX = Math.floor(Math.random() * screen.width);
            return [positionX, positionY];
        }
        let positionX = choixPositionX === 1 ? screen.width : 1;
        return [positionX, positionY];
    }
}

// Génère une boule et lance sa direction
function GenererBoule(p) {
    let boule = document.createElement("img");
    boule.classList.add("boule");
    document.body.append(boule);
    boule.style.top = `${p[1]}px`;
    boule.style.left = `${p[0]}px`;
    let fireball = new Fireball(boule, { width: 75, height: 42, offsetX: 112, offsetY: 129 });
    GenererDirection(fireball);
}

// Calcule la difficulté en fonction du score
function getDifficulty() {
    let currentScore = Number(score.textContent);
    return 1 + currentScore /60 ;
}

/**
 * Fonction qui génère une direction aléatoire et fait bouger la boule
 * @param {Fireball} p 
 */
function GenererDirection(p) {
    p.target.x = player.x + player.width / 2;
    p.target.y = player.y + player.height / 2;
    p.vector.x = p.target.x - p.x;
    p.vector.y = p.target.y - p.y;
    p.normalize();

    // Augmentation de la vitesse avec la difficulté
    let difficulty = getDifficulty();
    p.vector.x *= p.speed * difficulty;
    p.vector.y *= p.speed * difficulty;

    p.element.style.transform = `rotate(${trouverAngle(p, player)}deg)`;

    setInterval(() => {
        movefireball(p);
    }, 1000 / 60);
}

/** @param {Fireball} p  */
function movefireball(p) {
    p.x += p.vector.x;
    p.y += p.vector.y;
    if (p.x < 0 || p.x > screen.width || p.y < 0 || p.y > screen.height) {
        p.element.remove();
        return;
    }

    if (
        p.center.x < player.x + player.hitbox.offsetX + player.center.x + player.width &&
        p.center.x + p.hitbox.offsetX > player.x + player.hitbox.offsetX + player.center.x &&
        p.center.y < player.y + player.hitbox.offsetY + player.center.y + player.height &&
        p.center.y + p.hitbox.offsetX > player.y + player.hitbox.offsetY + player.center.y
    ) {
        p.element.remove();

        if (underShield === false) {
            //clearInterval(intervalScore);
            localStorage.score = score.textContent;
            // window.location.href = 'gameOver.html';
        }
    }
}

let posSourisXSpell = 0;
let posSourisYSpell = 0;

document.addEventListener('mousemove', function (event) {
    posSourisXSpell = event.clientX;
    posSourisYSpell = event.clientY;
});

window.addEventListener("keypress", (e) => {
    let posSourisX = posSourisXSpell;
    let posSourisY = posSourisYSpell;

    if (e.key === "f") {
        if (cdFlash === 0) {
            cdFlash = 15000;
            player.x = posSourisX + ((player.x - posSourisX) / 1.35);
            player.y = posSourisY + ((player.y - posSourisY) / 1.35);
            player.target.x = player.x;
            player.target.y = player.y;
            setTimeout(() => cdFlash = 0, cdFlash);
        }
    }

    if (e.key === "e") {
        if (!underghost) {
            underghost = true;
            cdGhost = 15000;
            player.speed = 10;
            let count = 0;
            let isBlue = false;

            const interval = setInterval(() => {
                player.element.style.backgroundColor = isBlue ? "blue" : "lightblue";
                isBlue = !isBlue;
                count++;
                if (count >= 30) {
                    clearInterval(interval);
                    player.speed = 5;
                    setTimeout(() => underghost = false, cdGhost);
                }
            }, 500);
        }
    }

    if (e.key === "d") {
        if (cdShield === 0) {
            underShield = true;
            cdShield = 15000;
            player.element.style.border = "solid grey 3px";
            setTimeout(() => {
                player.element.style.border = "none";
                underShield = false;
            }, 3000);
            setTimeout(() => cdShield = 0, cdShield);
        }
    }
});

/**
 * génère un angle
 * @param {Fireball} el1 
 * @param {Player} el2 
 */
function trouverAngle(el1, el2) {
    const deltaX = el1.x - el2.x;
    const deltaY = el2.y - el1.y;
    const angleBrute = Math.atan2(deltaX, deltaY);
    const angle = angleBrute * (180 / Math.PI);
    return angle;
}
