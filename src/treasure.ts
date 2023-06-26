import { Role } from "./role";
import { InvincibleState, Poisoned } from "./state";

export abstract class Treasure {
  private _symbol: string = "x";
  protected abstract _rate: number;
  protected abstract name: string;

  public beTouch(role: Role): void {
    console.log(`觸碰到寶物： ${this.name}`);
    return;
  }

  get symbol() {
    return this._symbol;
  }

  get rate() {
    return this._rate;
  }
}

export class SuperStar extends Treasure {
  protected _rate = 10;
  protected name = "Super Star";

  public beTouch(role: Role): void {
    super.beTouch(role);
    role.state = new InvincibleState(role);
  }
}

export class Poison extends Treasure {
  protected _rate = 90;
  protected name = "Poison";

  public beTouch(role: Role): void {
    super.beTouch(role);
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
