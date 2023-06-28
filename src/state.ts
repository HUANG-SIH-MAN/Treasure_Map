import { Role, RoleDirection } from "./role";

export enum Action {
  Move,
  Attack,
}

export abstract class State {
  protected abstract _name: string;
  protected role: Role;
  protected abstract affect_round: number;
  protected state_round: number;

  constructor(role: Role) {
    this.role = role;
    this.state_round = 1;
  }

  public startRound() {
    this.state_round++;
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

  protected async move(
    can_use_directions: RoleDirection[] = [
      RoleDirection.Up,
      RoleDirection.Down,
      RoleDirection.Left,
      RoleDirection.Right,
    ]
  ) {
    const direction = await this.role.getMoveDirection(can_use_directions);
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
    this.role.state = new InvincibleState(this.role);
  }

  public addHp(add_hp: number) {
    const new_hp = add_hp + this.role.hp;

    if (new_hp > this.role.full_hp) {
      this.role.setHp(this.role.full_hp);
      return;
    }

    if (add_hp + this.role.hp <= 0) {
      this.role.setHp(0);
      this.role.die();
      return;
    }

    this.role.setHp(new_hp);
    return;
  }

  get name() {
    return this._name;
  }
}

export class NormalState extends State {
  protected _name: string = "Normal";
  protected affect_round = 999999;
}

export class InvincibleState extends State {
  protected _name: string = "Invincible";
  protected affect_round = 2;

  public startRound() {
    super.startRound();

    if (this.state_round > this.affect_round) {
      this.role.state = new NormalState(this.role);
    }
    return;
  }

  public beAttacked() {
    console.log("無敵狀態，攻擊無效");
    return;
  }
}

export class PoisonedState extends State {
  protected _name: string = "Poisoned";
  protected affect_round = 3;
  private reduce_hp: number = -15;

  constructor(role: Role) {
    super(role);
    this.state_round = 0;
  }

  public startRound() {
    super.startRound();

    if (this.state_round > this.affect_round) {
      this.role.state = new NormalState(this.role);
      return;
    }

    this.role.addHp(this.reduce_hp);
    return;
  }
}

export class AcceleratedState extends State {
  protected _name: string = "Accelerated";
  protected affect_round = 3;

  constructor(role: Role) {
    super(role);
    this.state_round = 0;
  }

  public startRound() {
    super.startRound();

    if (this.state_round > this.affect_round) {
      this.role.state = new NormalState(this.role);
    }
    return;
  }

  public beAttacked() {
    console.log("被攻擊，恢復正常狀態");
    this.role.state = new NormalState(this.role);
    return;
  }

  public async action() {
    await super.action();
    await super.action();
    return;
  }
}

export class HealingState extends State {
  protected _name: string = "Healing";
  protected affect_round = 5;
  private add_hp: number = 30;

  constructor(role: Role) {
    super(role);
    this.state_round = 0;
  }

  public startRound() {
    super.startRound();

    if (this.state_round > this.affect_round) {
      this.role.state = new NormalState(this.role);
      return;
    }

    this.role.addHp(this.add_hp);
    return;
  }

  public addHp(add_hp: number) {
    super.addHp(add_hp);

    if (this.role.hp === this.role.full_hp) {
      this.role.state = new NormalState(this.role);
    }
    return;
  }
}

export class OrderlessState extends State {
  protected _name: string = "Orderless";
  protected affect_round = 3;

  constructor(role: Role) {
    super(role);
    this.state_round = 0;
  }

  public startRound() {
    super.startRound();

    if (this.state_round > this.affect_round) {
      this.role.state = new NormalState(this.role);
    }
    return;
  }

  public async action() {
    const can_use_directions =
      Math.random() > 0.5
        ? [RoleDirection.Up, RoleDirection.Down]
        : [RoleDirection.Left, RoleDirection.Right];

    await this.move(can_use_directions);
    return;
  }
}

export class StockpileState extends State {
  protected _name: string = "Stockpile";
  protected affect_round = 2;

  public startRound() {
    super.startRound();

    if (this.state_round > this.affect_round) {
      this.role.state = new EruptingState(this.role);
    }
    return;
  }

  public beAttacked() {
    console.log("被攻擊，恢復正常狀態");
    this.role.state = new NormalState(this.role);
    return;
  }
}

export class EruptingState extends State {
  protected _name: string = "Erupting";
  protected affect_round = 3;
  private harm: number = 50;

  public startRound() {
    super.startRound();

    if (this.state_round > this.affect_round) {
      this.role.state = new TeleportState(this.role);
    }
    return;
  }

  protected attack() {
    const be_attack_roles = [
      this.role.map.player,
      ...this.role.map.all_monster,
    ].filter((role) => role !== this.role);

    be_attack_roles.forEach((be_attack_role) =>
      be_attack_role.beAttacked(this.harm)
    );
  }
}

export class TeleportState extends State {
  protected _name: string = "Teleport";
  protected affect_round = 1;

  public startRound() {
    super.startRound();

    if (this.state_round > this.affect_round) {
      this.role.state = new NormalState(this.role);

      console.log(`${this.role.constructor.name} 隨機移動!!`);
      const old_coord = this.role.getStringCoord();
      this.role.map.removeObjectOnMap(old_coord);

      const new_coord = this.role.map.getRandomCoord();
      this.role.map.addObjectOnMap(new_coord.coord, this.role);
    }
    return;
  }
}
