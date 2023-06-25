import { Obstacle } from "./obstacle";
import { Treasure, randomCreateTreasure } from "./treasure";
import { Player, Monster, Role } from "./role";

export class Map {
  private _size: number;
  private position_map: { [coord: string]: Role | Obstacle | Treasure } = {};
  private player: Player;
  private all_monster: Monster[] = [];

  constructor(map_size: number = 5) {
    if (map_size < 5) {
      console.log(
        "map size should more than 5, use default value 5 to be map size"
      );
      map_size = 5;
    }

    this._size = map_size;

    const player_coord = this.getRandomCoord();
    this.player = new Player(this, player_coord.x_coord, player_coord.y_coord);
    this.addObjectOnMap(player_coord.coord, this.player);

    for (let i = 0; i < this._size; i++) {
      const monster_coord = this.getRandomCoord();
      const monster = new Monster(
        this,
        monster_coord.x_coord,
        monster_coord.y_coord
      );
      this.all_monster.push(monster);
      this.addObjectOnMap(monster_coord.coord, monster);
      this.addObjectOnMap(this.getRandomCoord().coord, randomCreateTreasure());
      this.addObjectOnMap(this.getRandomCoord().coord, new Obstacle());
    }
  }

  public async startRound(): Promise<void> {
    this.allRoleStartRound();
    this.printMap();
    this.printPlayerState();
    await this.player.action();

    return await this.startRound();
  }

  public getObjectByPosition(coord: string) {
    return this.position_map[coord];
  }

  private getRandomCoord(): {
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
      `player state: ${this.player.state.name}\nhp: ${this.player.hp}`
    );
    return;
  }

  private allRoleStartRound() {
    this.player.startRound();
    this.all_monster.forEach((monster) => monster.startRound());
    return;
  }

  get size() {
    return this._size;
  }
}
