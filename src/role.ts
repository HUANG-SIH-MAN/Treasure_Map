export abstract class Role {
  protected abstract _symbol: string;
  protected abstract _hp: number;

  get symbol() {
    return this._symbol;
  }

  get hp() {
    return this._hp;
  }
}

export enum PlayerDirection {
  Right = "→",
  Left = "←",
  Up = "↑",
  Down = "↓",
}

export class Player extends Role {
  protected _symbol: string;
  protected _hp = 300;

  constructor() {
    super();
    this._symbol = this.getRandomDirection();
  }

  private getRandomDirection() {
    const direction = [
      PlayerDirection.Down,
      PlayerDirection.Left,
      PlayerDirection.Right,
      PlayerDirection.Up,
    ];

    const random = Math.floor(Math.random() * 4);
    return direction[random];
  }
}

export class Monster extends Role {
  protected _symbol: string = "M";
  protected _hp = 1;
}
