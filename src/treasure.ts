import { Role } from "./role";
import {
  InvincibleState,
  PoisonedState,
  AcceleratedState,
  HealingState,
  OrderlessState,
  StockpileState,
  TeleportState,
} from "./state";

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
  protected _rate = 25;
  protected name = "Poison";

  public beTouch(role: Role): void {
    super.beTouch(role);
    role.state = new PoisonedState(role);
  }
}

export class AcceleratingPotion extends Treasure {
  protected _rate = 20;
  protected name = "Accelerating Potion";

  public beTouch(role: Role): void {
    super.beTouch(role);
    role.state = new AcceleratedState(role);
  }
}

export class HealingPotion extends Treasure {
  protected _rate = 15;
  protected name = "Healing Potion";

  public beTouch(role: Role): void {
    super.beTouch(role);
    role.state = new HealingState(role);
  }
}

export class DevilFruit extends Treasure {
  protected _rate = 10;
  protected name = "Devil Fruit";

  public beTouch(role: Role): void {
    super.beTouch(role);
    role.state = new OrderlessState(role);
  }
}

export class KingRock extends Treasure {
  protected _rate = 10;
  protected name = "King's Rock";

  public beTouch(role: Role): void {
    super.beTouch(role);
    role.state = new StockpileState(role);
  }
}

export class DokodemoDoor extends Treasure {
  protected _rate = 10;
  protected name = "Dokodemo Door";

  public beTouch(role: Role): void {
    super.beTouch(role);
    role.state = new TeleportState(role);
  }
}

export function randomCreateTreasure(): Treasure {
  const treasures: Treasure[] = [
    new SuperStar(),
    new Poison(),
    new AcceleratingPotion(),
    new HealingPotion(),
    new DevilFruit(),
    new KingRock(),
    new DokodemoDoor(),
  ];

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
