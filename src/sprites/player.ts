import { GAME_WORLD_TILE_HEIGHT, GAME_WORLD_TILE_WIDTH } from "../constants"
import InventoryScene from "../scenes/InventoryScene";
import GameScene from "../scenes/GameScene";
import { Properties, BaseActor } from "../resources/actors";
import { Item, AllItems } from "../resources/items";
import { GameSprite } from "./GameSprite";


class PlayerActor extends BaseActor {
  constructor() {
    super(new Properties(10, 10, 10, 10));
  }
}

enum PlayerActionState { NORMAL, ITEM_MODE }
enum PlayerSpriteState { FACE_DOWN, FACE_UP, FACE_LEFT, FACE_RIGHT };

export class Player extends GameSprite {
    private actor: PlayerActor;
    private spriteState: PlayerSpriteState;
    private _actionState: PlayerActionState;
    private inventoryScene: InventoryScene;

    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);

        this.inventoryScene = this.scene.scene.get("inventory") as InventoryScene;

        this.actor = new PlayerActor();
        this.spriteState = PlayerSpriteState.FACE_DOWN;
        this.updateOrientation();
        this.setOrigin(0, 0);
    }

    public recItem(item: Item): void {
      console.log(`Player got item ${item}`);
    }

    public isCollidable(): boolean {
      return true;
    }

    private updateOrientation() {
      this.setFlip(false, false);
      switch (this.spriteState) {
        case PlayerSpriteState.FACE_UP:
          this.setFrameRelative(2);
          break;
        case PlayerSpriteState.FACE_DOWN:
          this.setFrameRelative(0);
          break;
        case PlayerSpriteState.FACE_LEFT: {
          this.setFlip(true, false);
          this.setFrameRelative(1);
          break;
        }
        case PlayerSpriteState.FACE_RIGHT:
          this.setFrameRelative(1);
          break;
      }
    }

    isUsingItem(): boolean {
      return this._actionState === PlayerActionState.ITEM_MODE;
    }

    enterItemMode() {
      this._actionState = PlayerActionState.ITEM_MODE;
    }

    exitItemMode() {
      this._actionState = PlayerActionState.NORMAL;
    }

    getCurrentItem(): Item {
      // use the inventory scene here
      return this.inventoryScene.getItem();
    }

    faceRight() {
      this.spriteState = PlayerSpriteState.FACE_RIGHT;
      this._actionState = PlayerActionState.NORMAL;
      this.updateOrientation();
    }

    faceLeft() {
      this.spriteState = PlayerSpriteState.FACE_LEFT;
      this._actionState = PlayerActionState.NORMAL;
      this.updateOrientation();
    }

    faceDown() {
      this.spriteState = PlayerSpriteState.FACE_DOWN;
      this._actionState = PlayerActionState.NORMAL;
      this.updateOrientation();
    }

    faceUp() {
      this.spriteState = PlayerSpriteState.FACE_UP;
      this._actionState = PlayerActionState.NORMAL;
      this.updateOrientation();
    }

    moveRight() {
      this.x += GAME_WORLD_TILE_WIDTH
      this.faceRight();
    }

    moveLeft() {
      this.x -= GAME_WORLD_TILE_WIDTH
      this.faceLeft();
    }

    moveUp() {
      this.y -= GAME_WORLD_TILE_HEIGHT
      this.faceUp();
    }

    moveDown() {
      this.y += GAME_WORLD_TILE_HEIGHT
      this.faceDown();
    }

    get gridX(): number {
      return Math.floor(this.x / GAME_WORLD_TILE_WIDTH);
    }

    get gridY(): number {
      return Math.floor(this.y / GAME_WORLD_TILE_HEIGHT);
    }
}
