import * as helpers from "../helpers";

export class Agent {
  readonly id: number;
  readonly color: string;
  x: number;
  y: number;
  readonly strength: number;
  readonly intelligence: number;
  saturation: number;

  constructor(id: number, x: number, y: number, strength: number, intelligence: number, saturation: number) {
    this.id = id;
    this.color = helpers.randomColor();
    this.x = x;
    this.y = y;
    this.strength = strength;
    this.intelligence = intelligence;
    this.saturation = saturation;
  }

  static fromJSON(json: Record<string, any>): Agent {
    return new Agent(json.id, json.x, json.y, json.strength, json.intelligence, json.saturation)
  }
}
