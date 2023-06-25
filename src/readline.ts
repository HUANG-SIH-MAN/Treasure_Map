import { PlayerDirection } from "./role";
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
  return new Promise<PlayerDirection>((resolve) => {
    rl.question("選擇移動方向 (1)上 (2)下 (3)左 (4)右", (action) => {
      if (action === "1") {
        return resolve(PlayerDirection.Up);
      }

      if (action === "2") {
        return resolve(PlayerDirection.Down);
      }

      if (action === "3") {
        return resolve(PlayerDirection.Left);
      }

      if (action === "4") {
        return resolve(PlayerDirection.Right);
      }

      return playerMove();
    });
  });
}

export default {
  playerAction,
  playerMove,
};
