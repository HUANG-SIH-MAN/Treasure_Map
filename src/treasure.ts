import { Role } from "./role";
import { InvincibleState, Poisoned } from "./state";

export abstract class Treasure {
  private _symbol: string = "x";
  protected abstract _rate: number;

  public abstract beTouch(role: Role): void;

  get symbol() {
    return this._symbol;
  }

  get rate() {
    return this._rate;
  }
}

export class SuperStar extends Treasure {
  protected _rate = 10;

  public beTouch(role: Role): void {
    role.state = new InvincibleState(role);
  }
}

export class Poison extends Treasure {
  protected _rate = 90;

  public beTouch(role: Role): void {
    role.state = new Poisoned(role);
  }
}

export function randomCreateTreasure(): Treasure {
  const treasures: Treasure[] = [new SuperStar(), new Poison()];

  const totalRate = treasures.reduce((sum, treasure) => sum + treasure.rate, 0);
  const randomNumber = Math.random() * totalRate;

  let accumulatedRate = 0;
  for (const treasure of treasures) {
    accumulatedRate += treasure.rate;
    if (randomNumber < accumulatedRate) {
      return treasure;
    }
  }

  throw new Error("No treasure generated");
}
