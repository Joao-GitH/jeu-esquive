let joueur = document.getElementById("joueur")
Main()
// Fonction principale qui démarre la génération des boules
function Main() {
    setInterval(() => {
        GenererBoule(GenererPosition()) // Génère une boule toutes les secondes
    }, 100)
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
    
    GenererDirection(boule) // Démarre le mouvement de la boule
}

// Fonction pour générer une position aléatoire sur les bords de l'écran
function GenererPosition() {
    let choixPosition = Math.floor(Math.random() * 2) // Choisir entre X ou Y comme point de départ
    if (choixPosition == 1) {
        let positionX = Math.floor(Math.random() * screen.width)
        if (positionX > screen.width - 50) {
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

// Fonction qui génère une direction aléatoire et fait bouger la boule
function GenererDirection(p) {
    let vitesseX = Math.floor(Math.random() * 10 - 5) // Vitesse horizontale entre -5 et 5 pixels
    let vitesseY = Math.floor(Math.random() * 10 - 5) // Vitesse verticale entre -5 et 5 pixels
    
    setInterval(() => {
        let pActuelleY = parseInt(p.style.top) // Récupère la position Y actuelle
        let pActuelleX = parseInt(p.style.left) // Récupère la position X actuelle
        p.style.left = `${pActuelleX + vitesseX}px` // Déplace horizontalement
        p.style.top = `${pActuelleY + vitesseY}px` // Déplace verticalement
    }, 1000 / 200); // Rafraîchissement rapide pour un mouvement fluide
}
