Main()


function Main() {
    setInterval(() => {
        GenererBoule(GenererPosition())
    } ,1000)
    
}
function GenererBoule(p) {

        let boule = document.createElement("div")
        boule.classList.add("boule")
        let body = document.querySelector("body")
        body.append(boule)
        boule.style.height = "5vh"
        boule.style.width = "5vw"
        boule.style.position = "absolute"
        boule.style.top = `${p[1]}px`
        boule.style.left = `${p[0]}px`
        GenererDirection(boule)
}
function GenererPosition() {
    let choixPosition = Math.floor(Math.random()  * 2)
    if (choixPosition == 1) {
        let positionX = Math.floor(Math.random() * screen.width)
        if (positionX == screen.width) {
            let positionY = Math.floor(Math.random() * screen.height)
            return [positionX,positionY]
        }
        let choixPositionY = Math.floor(Math.random() * 2)
        if (choixPositionY == 1) {
            let positionY = screen.height
            return [positionX,positionY]
        }
        else{
            let positionY = 1
            return [positionX,positionY]
        }
    }
    else{
        let positionY = Math.floor(Math.random() * screen.height)
        let choixPositionX = Math.floor(Math.random())
        if (positionY == screen.height) {
            let positionX = Math.floor(Math.random() * screen.width)
            return [positionX,positionY]
        }
        if (choixPositionX == 1) {
            let positionX = screen.width
            return [positionX,positionY]
        }
        else{
            let positionX = 1
            return [positionX,positionY]
        }
    }
}

function GenererDirection(p){
    
        let vitesseX = Math.floor(Math.random() * 10 - 5)
        let vitesseY = Math.floor(Math.random() * 10 - 5)
    setInterval(() => {
        let pActuelleY = parseInt(p.style.top)
        let pActuelleX = parseInt(p.style.left)
        p.style.left = `${pActuelleX + vitesseX}px`
        p.style.top = `${pActuelleY + vitesseY}px`
    }, 1000/200);
}