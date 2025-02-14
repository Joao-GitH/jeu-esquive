class Fireball extends Entity{
    
    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLDivElement} element 
     */
    constructor(element){
        super(element)
        this.speed = getRandomArbitrary(5,10)

    }

}

class Player extends Entity{
    
    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLDivElement} element 
     */
    constructor(element){
        super(element)
    }
}
const player = new Player(document.querySelector("#joueur"));
/// NEW
let mouseDown = false;
addEventListener("mouseup", () => mouseDown = false)
addEventListener("mousedown", (e) => {
    mouseDown = true
    movePlayer(e);
})
addEventListener("contextmenu", e => e.preventDefault())
window.addEventListener("mousemove", movePlayer);
function movePlayer(e){
    if(mouseDown){
        player.target.x = e.clientX
        player.target.y = e.clientY
        player.vector.x = player.target.x - player.x;
        player.vector.y = player.target.y - player.y;
        player.normalize();
        player.vector.x *= player.speed;
        player.vector.y *= player.speed;
    }
}
///
function move() {
    if(player.distance() > player.magnitude()){
        player.x += player.vector.x;
        player.y += player.vector.y;
    }
    requestAnimationFrame(move);
}
move();

Main()
// Fonction principale qui démarre la génération des boules
function Main() {
    setInterval(() => {
        GenererBoule(GenererPosition()) // Génère une boule toutes les secondes
    }, 1000)
}

// Fonction pour générer une boule à une position donnée
function GenererBoule(p) {
    let boule = document.createElement("div") // Création d'un élément div
    boule.classList.add("boule") // Ajout d'une classe CSS pour le style
    let body = document.querySelector("body") // Sélection du corps de la page
    body.append(boule) // Ajout de la boule au body

    // Définition des styles de la boule
    boule.style.height = "50px"
    boule.style.width = "50px"
    boule.style.position = "absolute"
    boule.style.top = `${p[1]}px` // Position verticale aléatoire
    boule.style.left = `${p[0]}px` // Position horizontale aléatoire
    let fireball = new Fireball(boule)
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

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  

// Fonction qui génère une direction aléatoire et fait bouger la boule
function GenererDirection(p) {
    
    p.target.x = player.x
    p.target.y = player.y
    p.vector.x = p.target.x - p.x;
    p.vector.y = p.target.y - p.y;
    p.normalize();
    p.vector.x *= p.speed;
    p.vector.y *= p.speed;
    setInterval(() => {
        movefireball(p)
    }, 1000 / 60); // Rafraîchissement rapide pour un mouvement fluide
}
/** @param {Fireball} p  */
function movefireball(p) {
        p.x += p.vector.x;
        p.y += p.vector.y;
    if (p.x < 0 || p.x > screen.width) {
        p.element.remove()
        return
    }
    else if (p.y < 0 || p.y > screen.height) {
        p.element.remove()
        return
    }
    if (player.x > p.x && player.x < p.x + p.width && player.y > p.y && player.y < p.y + p.height) {
        p.element.remove()
        return
    }
}

