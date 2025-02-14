class Entity{
    
    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLDivElement} element 
     */
    constructor(element){
        this.element = element;
        this.element.style.position = "absolute";
        this.vector = {x:0, y:0};
        this.target = {x:0, y:0}
        this.speed = 5;
    }

    get x(){return this.element.getBoundingClientRect().left}
    set x(value){this.element.style.left = `${value}px`}

    get y(){return this.element.getBoundingClientRect().top}
    set y(value){this.element.style.top = `${value}px`}

    get width(){return parseInt(this.element.style.width)}
    set width(value){this.element.style.width = `${value}px`}

    get height(){return parseInt(this.element.style.height)}
    set height(value){this.element.style.height = `${value}px`}

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
}