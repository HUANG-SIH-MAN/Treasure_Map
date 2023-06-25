import { StateType } from "./state";

export class Treasure {
  private _symbol: string = "x";
  private name: string;
  private bestow_state: StateType;

  private all_treasure_type: {
    [key: string]: { name: string; bestow_state: StateType; rate: number };
  } = {
    super_star: {
      name: "Super Star",
      bestow_state: StateType.Invincible,
      rate: 10,
    },
    poison: {
      name: "Poison",
      bestow_state: StateType.Poisoned,
      rate: 25,
    },
    accelerating_potion: {
      name: "Accelerating Potion",
      bestow_state: StateType.Accelerated,
      rate: 20,
    },
    healing_potion: {
      name: "Healing Potion",
      bestow_state: StateType.Healing,
      rate: 15,
    },
    devil_fruit: {
      name: "Devil Fruit",
      bestow_state: StateType.Orderless,
      rate: 10,
    },
    king_rock: {
      name: "King's Rock",
      bestow_state: StateType.Stockpile,
      rate: 10,
    },
    dokodemo_door: {
      name: "Dokodemo Door",
      bestow_state: StateType.Teleport,
      rate: 10,
    },
  };

  constructor() {
    const treasure = this.getRandomTreasure();
    this.name = treasure.name;
    this.bestow_state = treasure.bestow_state;
  }

  private getRandomTreasure() {
    const treasure = Object.keys(this.all_treasure_type);
    const rate = Object.values(this.all_treasure_type).map(
      (property) => property.rate
    );

    const pool: string[] = [];
    for (let i = 0; i < treasure.length; i++) {
      for (let j = 0; j < rate[i]; j++) {
        pool.push(treasure[i]);
      }
    }

    const random = Math.floor(Math.random() * treasure.length);
    return this.all_treasure_type[pool[random]];
  }

  get symbol() {
    return this._symbol;
  }
}
