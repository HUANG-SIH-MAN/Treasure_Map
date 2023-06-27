import { State, NormalState, Action } from "./state";
import { Map } from "./map";
import { Obstacle } from "./obstacle";
import { Treasure } from "./treasure";
import readline from "./readline";

export abstract class Role {
  protected abstract _symbol: string;
  protected abstract _hp: number;
  protected abstract _harm: number;
  protected abstract _full_hp: number;
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

  public abstract getAttackRangeRole(): Role[];
  public abstract getActionChoose(): Promise<Action>;
  public abstract getMoveDirection(): Promise<RoleDirection>;

  public startRound() {
    this._state.startRound();
    return;
  }

  // FIXME: 在重構一下
  public getNewCoord(direction: RoleDirection): string {
    const old_coord = this.getStringCoord();
    let new_coord: string;
    let size: number;
    switch (direction) {
      case RoleDirection.Up:
        size = this._y_coord + 1;
        new_coord = `${this._x_coord}-${this._y_coord + 1}`;
        break;
      case RoleDirection.Down:
        size = this._y_coord - 1;
        new_coord = `${this._x_coord}-${this._y_coord - 1}`;
        break;
      case RoleDirection.Right:
        size = this._x_coord + 1;
        new_coord = `${this._x_coord + 1}-${this._y_coord}`;
        break;
      case RoleDirection.Left:
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
    const old_coord = this.getStringCoord();
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

  public async action() {
    await this._state.action();
    return;
  }

  public beAttacked(harm: number) {
    this.state.beAttacked(harm);
  }

  public addHp(add_hp: number) {
    this._state.addHp(add_hp);
    return;
  }

  public getStringCoord() {
    return `${this._x_coord}-${this._y_coord}`;
  }

  public die() {
    this._map.removeObjectOnMap(this.getStringCoord());
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

  public setHp(hp: number) {
    this._hp = hp;
    return;
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

  get harm() {
    return this._harm;
  }

  get full_hp() {
    return this._full_hp;
  }
}

export enum RoleDirection {
  Right = "→",
  Left = "←",
  Up = "↑",
  Down = "↓",
}

export class Player extends Role {
  protected _full_hp: number = 300;
  protected _symbol: string;
  protected _hp = 300;
  protected _harm = 1;

  constructor(map: Map, x_coord: number, y_coord: number) {
    super(map, x_coord, y_coord);
    this._symbol = this.getRandomDirection();
  }

  private getRandomDirection() {
    const direction = [
      RoleDirection.Down,
      RoleDirection.Left,
      RoleDirection.Right,
      RoleDirection.Up,
    ];

    const random = Math.floor(Math.random() * 4);
    return direction[random];
  }

  public setSymbol(direction: RoleDirection) {
    this._symbol = direction;
    return;
  }

  public getAttackRangeRole() {
    // FIXME: 這個要在重構一下，超醜
    const be_attac_role: Role[] = [];
    let object: Role | Treasure | Obstacle;
    switch (this._symbol) {
      case RoleDirection.Up:
        for (let i = this._y_coord + 1; i < this._map.size; i++) {
          object = this._map.getObjectByPosition(`${this._x_coord}-${i}`);
          if (object instanceof Obstacle) {
            break;
          }
          if (object instanceof Monster) {
            be_attac_role.push(object);
          }
        }
        break;
      case RoleDirection.Down:
        for (let i = this._y_coord - 1; i >= 0; i--) {
          object = this._map.getObjectByPosition(`${this._x_coord}-${i}`);
          if (object instanceof Obstacle) {
            break;
          }
          if (object instanceof Monster) {
            be_attac_role.push(object);
          }
        }
        break;
      case RoleDirection.Left:
        for (let i = this._x_coord - 1; i >= 0; i--) {
          object = this._map.getObjectByPosition(`${i}-${this._y_coord}`);
          if (object instanceof Obstacle) {
            break;
          }
          if (object instanceof Monster) {
            be_attac_role.push(object);
          }
        }
        break;
      case RoleDirection.Right:
        for (let i = this._x_coord + 1; i < this._map.size; i++) {
          object = this._map.getObjectByPosition(`${i}-${this._y_coord}`);
          if (object instanceof Obstacle) {
            break;
          }
          if (object instanceof Monster) {
            be_attac_role.push(object);
          }
        }
        break;
    }
    return be_attac_role;
  }

  public async getActionChoose() {
    return await readline.playerAction();
  }

  public async getMoveDirection() {
    const direction = await readline.playerMove();
    this.setSymbol(direction);
    return direction;
  }
}

export class Monster extends Role {
  protected _full_hp: number = 1;
  protected _symbol: string = "M";
  protected _hp = 1;
  protected _harm = 50;

  public async getActionChoose() {
    const be_attack_roles = this.getAttackRangeRole();

    if (be_attack_roles.length > 0) {
      console.log(`${this.getStringCoord()} 怪物攻擊`);
      return Action.Attack;
    }

    console.log(`${this.getStringCoord()} 怪物移動`);
    return Action.Move;
  }

  public getAttackRangeRole() {
    const be_attac_role: Role[] = [];
    const player = this._map.player;

    if (this.isAround(player)) {
      be_attac_role.push(player);
    }

    return be_attac_role;
  }

  private isAround(role: Role) {
    const distance =
      Math.abs(this._x_coord - role.x_coord) +
      Math.abs(this._y_coord - role.y_coord);

    return distance === 1 ? true : false;
  }

  public die() {
    super.die();
    this._map.removeMonster(this);
    return;
  }

  public async getMoveDirection() {
    const direction = [
      RoleDirection.Up,
      RoleDirection.Down,
      RoleDirection.Left,
      RoleDirection.Right,
    ];
    const random = Math.floor(Math.random() * 4);
    console.log(`移動方向${direction[random]}`);
    return direction[random];
  }
}
