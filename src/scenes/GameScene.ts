import { Player } from "../sprites/player";
import ReadoutScene from "./ReadoutScene";
import { TEXT_AREA_HEIGHT_PX, GAME_WORLD_TILE_WIDTH, GAME_WORLD_TILE_HEIGHT } from "../constants";
import SpriteLoader from '../SpriteLoader';
import { Enemy } from "../sprites/enemy";
import { ItemTargetOverlay } from "./itemTargetOverlay"
import { Attack } from "../sprites/Attack";

export default class GameScene extends Phaser.Scene {
    private player: Player;
    private enemy: Enemy;
    // enemies/ creatures

    private exampleText: Phaser.GameObjects.Text;
    private exampleActive: boolean = true;
    private inventoryKey: Phaser.Input.Keyboard.Key;
    private itemModeKey: Phaser.Input.Keyboard.Key;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private readoutScene: ReadoutScene;
    private tileMap: Phaser.Tilemaps.Tilemap;
    private itemTargetChoicesOverlay: ItemTargetOverlay;

    constructor() {
        super({ key: "game" })
    }

    public preload() {
        this.load.image("tiles", "../assets/tiles.png");
        this.load.spritesheet("tiles_sprites", "../assets/tiles.png", {
            frameWidth: 32, frameHeight: 32
        });
        this.load.tilemapTiledJSON("level_1", "../assets/level_1.json");
        this.load.tilemapTiledJSON("level_2", "../assets/level_2.json");
    }

    public create() {
        this.exampleText = this.add.text(10, 10, "Hi Everybody", { font: '16px Courier', fill: '#00ff00' });
        this.game.input.mouse.capture = true;
        this.inventoryKey = this.input.keyboard.addKey("I");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.itemModeKey = this.input.keyboard.addKey("Z");

        this.tileMap = this.make.tilemap({ key: 'level_1' });
        const tileset: Phaser.Tilemaps.Tileset = this.tileMap.addTilesetImage('tiles', 'tiles');

        this.tileMap.createStaticLayer("Map", tileset, 0, 0);

        const level1SpriteMap = new Map<number, any>([
            [16, { key: "tiles_sprites", frame: 15 }]
        ]);
        
        const sprites: Map<number, Phaser.GameObjects.Sprite[]> = SpriteLoader.createSpritesFromTileset(
            level1SpriteMap,
            this,
            this.tileMap.getLayer("Objects"),
            tileset
        );
        console.log(sprites);

        this.cameras.main.setBounds(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
        this.cameras.main.setViewport(0, 0, this.game.canvas.width, this.game.canvas.height - TEXT_AREA_HEIGHT_PX);

        this.player = new Player(this, 96, 96, "tiles_sprites");
        this.player.setOrigin(0, 0);

        this.add.existing(this.player);

        this.enemy = new Enemy(this, 192, 192, "tiles_sprites")
        this.add.existing(this.enemy);

        // Apparently you can't just instanciate it 🤦‍
        // Also you can't write to the readout scene here, wait until next event loop
        this.scene.launch("readout");
        this.readoutScene = this.scene.get("readout") as ReadoutScene;

        this.itemTargetChoicesOverlay = new ItemTargetOverlay(this);
    }

    public write(text: string) {
        this.readoutScene.write(text);
    }

    private getTileProperty(tileX: number, tileY: number, property: string): any {
        return (this.tileMap.getTileAt(tileX, tileY).properties as any)[property];
    }

    public playerCanMove(playerTileX: number, playerTileY: number) {
        if (playerTileX < 0 || playerTileX > this.tileMap.width || playerTileY < 0 || playerTileY > this.tileMap.height) {
            return false;
        }
        return !(this.getTileProperty(playerTileX, playerTileY, "collision"));
    }

    private handleMoveInput(): boolean {
        const playerTileX = this.player.gridX;
        const playerTileY = this.player.gridY;

        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
            if (this.playerCanMove(playerTileX, playerTileY - 1)) {
                this.player.moveUp();
                return true;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
            if (this.playerCanMove(playerTileX, playerTileY + 1)) {
                this.player.moveDown();
                return true;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
            if (this.playerCanMove(playerTileX - 1, playerTileY)) {
                this.player.moveLeft();
                return true;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
            if (this.playerCanMove(playerTileX + 1, playerTileY)) {
                this.player.moveRight();
                return true;
            }
        }

        return false;
    }

    private handleItemInput(): void {
        const playerTileX = this.player.gridX;
        const playerTileY = this.player.gridY;

        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
          this.player.exitItemMode();
          this.player.faceUp();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
          this.player.exitItemMode();
          this.player.faceDown();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
          this.player.exitItemMode();
          this.player.faceLeft();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
          this.player.exitItemMode();
          this.player.faceRight();
        }

        if(!this.player.isUsingItem()) {
          this.itemTargetChoicesOverlay.clear();
        }
    }

    private handleKeyboardInputs() {
        if (Phaser.Input.Keyboard.JustDown(this.itemModeKey) && !this.player.isUsingItem()) {
            this.player.enterItemMode();
            this.itemTargetChoicesOverlay.render(this.player);
        } else if(this.player.isUsingItem()) {
            this.handleItemInput();
        } else {
          if (this.handleMoveInput()) {
              this.enemy.update_position(this.player);
          }
        }
    }

    public update(time: number, delta: number) {
        super.update(time, delta);

        if (Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
            this.scene.switch("inventory");
            let superlative = ["good job", "lol", "nice", "great", "super", "stellar"][(Math.random() * 6) | 0]
            this.write(`Opened Inventory (${superlative})`);
        }

        //if (this.input.mouse.onMouseDown()) this.exampleActive = !this.exampleActive;

        if (this.exampleActive) this.exampleText.setAlpha(1);
        else this.exampleText.setAlpha(0);

        this.handleKeyboardInputs();
    }
}
