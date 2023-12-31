import { Obstacle } from "./obstacle";
import { Treasure, randomCreateTreasure } from "./treasure";
import { Player, Monster, Role } from "./role";

export class Map {
  private _size: number;
  private position_map: { [coord: string]: Role | Obstacle | Treasure } = {};
  private _player: Player;
  private _all_monster: Monster[] = [];

  constructor(map_size: number = 5) {
    if (map_size < 5) {
      console.log(
        "map size should more than 5, use default value 5 to be map size"
      );
      map_size = 5;
    }

    this._size = map_size;

    const player_coord = this.getRandomCoord();
    this._player = new Player(this, player_coord.x_coord, player_coord.y_coord);
    this.addObjectOnMap(player_coord.coord, this._player);

    for (let i = 0; i < this._size; i++) {
      const monster_coord = this.getRandomCoord();
      const monster = new Monster(
        this,
        monster_coord.x_coord,
        monster_coord.y_coord
      );
      this._all_monster.push(monster);
      this.addObjectOnMap(monster_coord.coord, monster);
      this.addObjectOnMap(this.getRandomCoord().coord, randomCreateTreasure());
      this.addObjectOnMap(this.getRandomCoord().coord, new Obstacle());
    }
  }

  public async startRound(): Promise<void> {
    this.allRoleStartRound();
    this.printMap();
    this.printPlayerState();

    await this._player.action();
    for (const monster of this._all_monster) {
      await monster.action();
    }

    if (this.isGameOver()) {
      return;
    }

    this.randomCreateMonsterOnMap();
    this.randomCreateTreasureOnMap();
    return await this.startRound();
  }

  public getObjectByPosition(coord: string) {
    return this.position_map[coord];
  }

  public getRandomCoord(): {
    coord: string;
    x_coord: number;
    y_coord: number;
  } {
    const x_coord = Math.floor(Math.random() * this._size);
    const y_coord = Math.floor(Math.random() * this._size);
    const coord = `${x_coord}-${y_coord}`;

    if (this.position_map[coord]) {
      return this.getRandomCoord();
    }

    return { coord, x_coord, y_coord };
  }

  public addObjectOnMap(coord: string, object: Role | Obstacle | Treasure) {
    this.position_map[coord] = object;
    return;
  }

  public removeObjectOnMap(coord: string) {
    delete this.position_map[coord];
    return;
  }

  public removeMonster(target_monster: Monster) {
    this._all_monster = this._all_monster.filter(
      (monster) => monster !== target_monster
    );
    return;
  }

  public isCoordCorrect(x_coord: number, y_coord: number) {
    if (
      x_coord < 0 ||
      y_coord < 0 ||
      x_coord >= this._size ||
      y_coord >= this._size
    ) {
      return false;
    }

    return true;
  }

  private printMap() {
    console.log("    Treasure Map    \n");
    for (let y = this._size - 1; y >= 0; y--) {
      const list: string[] = [];
      for (let x = 0; x < this._size; x++) {
        const coord = `${x}-${y}`;
        list.push(this.position_map[coord]?.symbol || ".");
      }
      console.log(`${list.join("   ")}\n`);
    }
    return;
  }

  private printPlayerState() {
    console.log(
      `player state: ${this._player.state.name}\nhp: ${this._player.hp}`
    );
    return;
  }

  private allRoleStartRound() {
    this._player.startRound();
    this._all_monster.forEach((monster) => monster.startRound());
    return;
  }

  private isGameOver(): boolean {
    if (this._player.hp === 0) {
      console.log("玩家死亡，遊戲結束 !!");
      return true;
    }

    if (this._all_monster.length === 0) {
      console.log("玩家擊敗所有怪物，遊戲勝利 !!");
      return true;
    }

    return false;
  }

  private randomCreateMonsterOnMap() {
    const monster_rate = 0.3;
    if (Math.random() < monster_rate) {
      const monster_coord = this.getRandomCoord();
      const monster = new Monster(
        this,
        monster_coord.x_coord,
        monster_coord.y_coord
      );
      this._all_monster.push(monster);
      this.addObjectOnMap(monster_coord.coord, monster);
      console.log(`每回合隨機生成怪物 * 1，位置：${monster_coord}`);
    }

    return;
  }

  private randomCreateTreasureOnMap() {
    const treasure_rate = 0.5;
    if (Math.random() < treasure_rate) {
      const { coord } = this.getRandomCoord();
      this.addObjectOnMap(coord, randomCreateTreasure());
      console.log(`每回合隨機生成寶箱 * 1，位置：${coord}`);
    }

    return;
  }

  get size() {
    return this._size;
  }

  get player() {
    return this._player;
  }

  get all_monster() {
    return this._all_monster;
  }
}
