import { Obstacle } from "./obstacle";
import { Treasure } from "./treasure";
import { Player, Monster, Role } from "./role";

export class Map {
  private size: number;
  private position_map: { [coord: string]: Role | Obstacle | Treasure } = {};

  constructor(map_size: number = 5) {
    if (map_size < 5) {
      console.log(
        "map size should more than 5, use default value 5 to be map size"
      );
      map_size = 5;
    }

    this.size = map_size;
    this.addObjectOnMap(this.getRandomCoord(), new Player());

    for (let i = 0; i < this.size; i++) {
      this.addObjectOnMap(this.getRandomCoord(), new Obstacle());
      this.addObjectOnMap(this.getRandomCoord(), new Monster());
      this.addObjectOnMap(this.getRandomCoord(), new Treasure());
    }
  }

  public startRound() {
    this.printMap();
    return;
  }

  private getRandomCoord(): string {
    const x = Math.floor(Math.random() * this.size);
    const y = Math.floor(Math.random() * this.size);
    const coord = `${x}-${y}`;

    if (this.position_map[coord]) {
      return this.getRandomCoord();
    }

    return coord;
  }

  private addObjectOnMap(coord: string, object: Role | Obstacle | Treasure) {
    this.position_map[coord] = object;
    return;
  }

  private printMap() {
    console.log("    Treasure Map    \n");
    for (let y = 0; y < this.size; y++) {
      const list: string[] = [];
      for (let x = 0; x < this.size; x++) {
        const coord = `${x}-${y}`;
        list.push(this.position_map[coord]?.symbol || ".");
      }
      console.log(`${list.join("   ")}\n`);
    }
    return;
  }
}
