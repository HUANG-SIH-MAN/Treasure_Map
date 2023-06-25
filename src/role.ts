import { State, NormalState } from "./state";
import { Map } from "./map";
import { Obstacle } from "./obstacle";
import { Treasure } from "./treasure";

export abstract class Role {
  protected abstract _symbol: string;
  protected abstract _hp: number;
  protected _state: State;
  protected _x_coord: number;
  protected _y_coord: number;
  protected _map: Map;

  constructor(map: Map, x_coord: number, y_coord: number) {
    this._map = map;
    this._x_coord = x_coord;
    this._y_coord = y_coord;
    this._state = new NormalState(this);
  }

  public startRound() {
    this._state.startRound();
    return;
  }

  public getNewCoord(direction: PlayerDirection): string {
    const old_coord = `${this._x_coord}-${this._y_coord}`;
    let new_coord: string;
    let size: number;
    switch (direction) {
      case PlayerDirection.Up:
        size = this._y_coord + 1;
        new_coord = `${this._x_coord}-${this._y_coord + 1}`;
        break;
      case PlayerDirection.Down:
        size = this._y_coord - 1;
        new_coord = `${this._x_coord}-${this._y_coord - 1}`;
        break;
      case PlayerDirection.Right:
        size = this._x_coord + 1;
        new_coord = `${this._x_coord + 1}-${this._y_coord}`;
        break;
      case PlayerDirection.Left:
        size = this._x_coord - 1;
        new_coord = `${this._x_coord - 1}-${this._y_coord}`;
        break;
      default:
        throw new Error("Invalid direction");
    }

    if (size < 0 || size >= this._map.size) {
      return old_coord;
    }

    return new_coord;
  }

  public move(new_coord: string) {
    const old_coord = `${this._x_coord}-${this._y_coord}`;
    this.map.removeObjectOnMap(old_coord);
    this._map.addObjectOnMap(new_coord, this);
    const [x_coord, y_coord] = new_coord.split("-");
    this._x_coord = Number(x_coord);
    this._y_coord = Number(y_coord);
  }

  public touch(object: Role | Obstacle | Treasure, new_coord: string) {
    if (object instanceof Role || object instanceof Obstacle) {
      return;
    }

    if (object instanceof Treasure) {
      object.beTouch(this);
      this._map.removeObjectOnMap(new_coord);
      this.move(new_coord);
      return;
    }

    return;
  }

  get symbol() {
    return this._symbol;
  }

  get hp() {
    return this._hp;
  }

  get state() {
    return this._state;
  }

  set state(state: State) {
    this._state = state;
  }

  get x_coord() {
    return this._x_coord;
  }

  get y_coord() {
    return this._y_coord;
  }

  get map() {
    return this._map;
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

  constructor(map: Map, x_coord: number, y_coord: number) {
    super(map, x_coord, y_coord);
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

  public async action() {
    await this._state.playerAction();
    return;
  }

  public setSymbol(direction: PlayerDirection) {
    this._symbol = direction;
    return;
  }
}

export class Monster extends Role {
  protected _symbol: string = "M";
  protected _hp = 1;
}
