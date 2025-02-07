document.addEventListener("DOMContentLoaded", (e)=>{
    let main = document.querySelector("main");
    let div = document.createElement("div");
    main.appendChild(div)
})


window.addEventListener(`contextmenu`, (e) => {
    e.preventDefault();
    let div = document.querySelector("div");
    let animations = div.getAnimations();
    if (animations.length > 0) {
        console.log("Animation détectée, annulation en cours...");
        animations.forEach(animation => animation.cancel()); // Annule toutes les animations
        return
    }

    let cliqueX = e.clientX
    let cliqueY = e.clientY
    
    let posXdiv = parseInt(getComputedStyle(div).left) || 0;
    let posYdiv = parseInt(getComputedStyle(div).top) || 0;
    let largeurDiv = parseInt(getComputedStyle(div).width) || 0;
    let hauteurDiv = parseInt(getComputedStyle(div).height) || 0;
    let speed = 8;
    function move() {

        let dx = cliqueX - largeurDiv/2 - posXdiv;
        let dy = cliqueY -  hauteurDiv - posYdiv;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < speed) {
            div.style.left = cliqueX - largeurDiv/2 + "px";
            div.style.top = cliqueY - hauteurDiv + "px";
        } else {
            posXdiv += (dx / distance) * speed;
            posYdiv += (dy / distance) * speed;
            div.style.left = posXdiv + "px";
            div.style.top = posYdiv + "px";
            requestAnimationFrame(move);
        }
    }

    move();

});

