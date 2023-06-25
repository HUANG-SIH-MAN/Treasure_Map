import { Role, Player } from "./role";
import readline from "./readline";

export enum Action {
  Move,
  Attack,
}

export abstract class State {
  protected abstract _name: string;
  protected role: Role;

  constructor(role: Role) {
    this.role = role;
  }

  public startRound() {
    return;
  }

  public async playerAction() {
    if (!(this.role instanceof Player)) {
      return;
    }

    const action = await readline.playerAction();
    if (action === Action.Attack) {
      return;
    }

    if (action === Action.Move) {
      await this.playerMove();
      return;
    }
  }

  protected async playerMove() {
    if (!(this.role instanceof Player)) {
      return;
    }

    const direction = await readline.playerMove();
    this.role.setSymbol(direction);
    const new_coord = this.role.getNewCoord(direction);
    const object = this.role.map.getObjectByPosition(new_coord);

    if (object) {
      this.role.touch(object, new_coord);
      return;
    }

    this.role.move(new_coord);
    return;
  }

  get name() {
    return this._name;
  }
}

export class NormalState extends State {
  protected _name: string = "Normal";
}

export class InvincibleState extends State {
  protected _name: string = "Invincible";
}

export class Poisoned extends State {
  protected _name: string = "Poisoned";
}
