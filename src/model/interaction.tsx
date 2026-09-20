import type { Agent } from "./agent";

export class Interaction {
    readonly from: Agent;
    readonly to: Agent;
    readonly message: string

    constructor (from: Agent, to: Agent, message: string) {
        this.from = from
        this.to = to
        this.message = message
    }
}