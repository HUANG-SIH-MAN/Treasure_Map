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

      return playerAction();
    });
  });
}

async function playerMove() {
  return new Promise<RoleDirection>((resolve) => {
    rl.question("選擇移動方向 (1)上 (2)下 (3)左 (4)右", (action) => {
      if (action === "1") {
        return resolve(RoleDirection.Up);
      }

      if (action === "2") {
        return resolve(RoleDirection.Down);
      }

      if (action === "3") {
        return resolve(RoleDirection.Left);
      }

      if (action === "4") {
        return resolve(RoleDirection.Right);
      }

      return playerMove();
    });
  });
}

export default {
  playerAction,
  playerMove,
};
