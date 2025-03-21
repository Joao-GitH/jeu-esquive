export class ColliderType{
    static static = new ColliderType("static");
    static dynamic = new ColliderType("dynamic");
    static transparent = new ColliderType("transparent");
    /** @type {string} */
    #value;

    /**
     * Creates an instance of `ColliderType`.
     *
     * @constructor
     * @param {string} value
     */
    constructor(value){
        this.#value = value;
    }

    toString(){
        return this.#value;
    }
}