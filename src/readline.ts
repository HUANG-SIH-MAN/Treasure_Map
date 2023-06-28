import { RoleDirection } from "./role";
import { Action } from "./state";

import * as readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function playerAction() {
  return new Promise<Action>((resolve) => {
    rl.question("選擇行動 (1)移動 (2)攻擊", (action) => {
      if (action === "1") {
        return resolve(Action.Move);
      }

      if (action === "2") {
        return resolve(Action.Attack);
      }

      return playerAction().then(resolve);
    });
  });
}

async function playerMove(can_use_directions: RoleDirection[]) {
  let choose = "";
  can_use_directions.forEach((direction, index) => {
    choose += `(${index + 1}) ${direction}`;
  });
  return new Promise<RoleDirection>((resolve) => {
    rl.question(`選擇移動方向 ${choose}`, (answer) => {
      const action = Number(answer);
      if (action <= 0 || action > can_use_directions.length) {
        return playerMove(can_use_directions).then(resolve);
      }

      return resolve(can_use_directions[action - 1]);
    });
  });
}

export default {
  playerAction,
  playerMove,
};
