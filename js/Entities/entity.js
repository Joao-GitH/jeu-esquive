export class Entity{
    
    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLImageElement} element 
     */
    constructor(element){
        this.element = element;
        this.element.style.position = "absolute";
        this.vector = {x:0, y:0};
        this.target = {x:this.x, y:this.y}
        this.speed = 5;
    }

    get x(){return parseInt(this.element.style.left)}
    set x(value){this.element.style.left = `${value}px`}

    get y(){return parseInt(this.element.style.top)}
    set y(value){this.element.style.top = `${value}px`}

    get width(){return this.element.getBoundingClientRect().width}
    set width(value){this.element.style.width = `${value}px`}

    get height(){return this.element.getBoundingClientRect().height}
    set height(value){this.element.style.height = `${value}px`}

    get center(){return {x:this.x + this.width / 2, y:this.y + this.height / 2}}

    magnitude() {
        return Math.sqrt(this.vector.x * this.vector.x + this.vector.y * this.vector.y);
    }
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            this.vector.x = 0;
            this.vector.y = 0;
        }
        this.vector.x /= mag;
        this.vector.y /= mag;
    }
    distance(){
        return Math.sqrt(Math.pow(this.x - this.target.x, 2) + Math.pow(this.y - this.target.y, 2))
    }
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
}