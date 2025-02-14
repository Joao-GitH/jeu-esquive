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

let posSourisXSpell = 0;
let posSourisYSpell = 0;

const player = new Player(document.querySelector("#joueur"));

window.addEventListener(`contextmenu`, (e) => {
    e.preventDefault();
    let div = document.querySelector("div");
    let animations = div.getAnimations();
    if (animations.length > 0) {
        console.log("Animation détectée, annulation en cours...");
        animations.forEach(animation => animation.cancel()); // Annule toutes les animations
        return
    }
})

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

window.addEventListener("keypress", (e)=>{
    console.log(e.key);
    let posSourisX = posSourisXSpell
    let posSourisY = posSourisYSpell
    if (e.key == "f")
    {
        
        player.x = posSourisX + ((player.x - posSourisX)/1.35);
        player.y = posSourisY + ((player.y - posSourisY)/1.35);
        

        player.vector.x = 0;
        player.vector.y = 0
    }
    if (e.key === "e") {
        let divPlayer = document.querySelector("#joueur");
        player.speed = 10;
        let count = 0;
        let isBlue = false; // Permet d'alterner entre bleu clair et bleu foncé
    
        const interval = setInterval(() => {
            divPlayer.style.backgroundColor = isBlue ? "blue" : "lightblue";
            isBlue = !isBlue; // Alterne entre bleu et bleu clair
    
            count++;
            if (count >= 30) { // 30 cycles = 15 secondes (1 cycle = 500ms)
                clearInterval(interval);
                divPlayer.style.backgroundColor = "blue"; // Assure un retour en bleu à la fin
                player.speed = 5; // Réinitialisation de la vitesse
            }
        }, 500); // Alterne toutes les 500ms pour 1s complète entre bleu et bleu clair
    }
    
})

document.addEventListener('mousemove', function(event) {
    posSourisXSpell = event.clientX
    posSourisYSpell = event.clientY
    
});
