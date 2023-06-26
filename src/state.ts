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

  public async action() {
    const action = await this.role.getActionChoose();

    if (action === Action.Attack) {
      this.attack();
      return;
    }

    if (action === Action.Move) {
      await this.move();
      return;
    }
  }

  protected async move() {
    const direction = await this.role.getMoveDirection();
    const new_coord = this.role.getNewCoord(direction);
    const object = this.role.map.getObjectByPosition(new_coord);

    if (object) {
      this.role.touch(object, new_coord);
      return;
    }

    this.role.move(new_coord);
    return;
  }

  protected attack() {
    const be_attack_roles = this.role.getAttackRangeRole();
    be_attack_roles.forEach((be_attack_role) =>
      be_attack_role.beAttacked(this.role.harm)
    );
  }

  public beAttacked(harm: number) {
    this.role.addHp(-harm);
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
