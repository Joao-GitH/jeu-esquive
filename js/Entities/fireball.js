import { Entity } from "./entities.js"
export class Fireball extends Entity {

    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLImageElement} element 
     */
    constructor(element) {
        super(element)
        this.speed = this.getRandomArbitrary(5, 10)

    }

}
