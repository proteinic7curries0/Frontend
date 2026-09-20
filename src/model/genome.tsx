import * as helpers from "../helpers";

export class Genome {
    readonly id: number;
    readonly color: string;

    constructor(id: number) {
        this.id = id;
        this.color = helpers.randomColor();
    }
}