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

const player = new Player(document.querySelector("div"));

window.addEventListener(`contextmenu`, (e) => {
    e.preventDefault();
    let div = document.querySelector("div");
    let animations = div.getAnimations();
    if (animations.length > 0) {
        console.log("Animation détectée, annulation en cours...");
        animations.forEach(animation => animation.cancel()); // Annule toutes les animations
        return
    }

    player.target.x = e.clientX
    player.target.y = e.clientY
    player.vector.x = player.target.x - player.x;
    player.vector.y = player.target.y - player.y;
    player.normalize();
    player.vector.x *= player.speed;
    player.vector.y *= player.speed;
    
});

function move() {
    if(player.distance() > player.magnitude()){
        player.x += player.vector.x;
        player.y += player.vector.y;
    }
    requestAnimationFrame(move);
}
move();