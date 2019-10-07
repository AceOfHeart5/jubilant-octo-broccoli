import Level from './Level';
import { Gate } from '../sprites/Gate';
import { IceWall } from '../sprites/IceWall';
import { Guard } from "../sprites/Guard";
import { Player } from '../sprites/player';
import { GameSprite } from '../sprites/GameSprite';
import SpriteLoader from '../SpriteLoader';
import GameScene from '../scenes/GameScene';
import {LevelData, LEVEL_DATA} from './LevelData';
import { TextArea } from '../sprites/TextArea';

export default class LevelLoader {
    public static async loadLevel(scene: GameScene, levelNum: number): Promise<Level> {
        let tileMap: Phaser.Tilemaps.Tilemap = await LevelLoader.asyncLoadTilemap(scene, levelNum);
        const level1SpriteMap = new Map<number, any>([
            [16, Gate],
            [23, Player],
            [26, Gate],
            // TODO THESE ARE WRONG NONONONONO
            [30, Gate],
            [29, TextArea],
            [48, Guard],
            [47, Gate],
            [1, Gate],
            [46, Gate],
            [31, IceWall]
        ]);

        const sprites: Map<number, GameSprite[]> = SpriteLoader.createSpritesFromTileset(
            level1SpriteMap,
            scene,
            tileMap.getLayer("Objects"),
            tileMap.getTileset("tiles")
        );

        let levelData: LevelData = LEVEL_DATA[levelNum - 1];

        return new Level(sprites, tileMap, levelData.validWords, levelData.textAreas);
    }

    public static async asyncLoadTilemap(scene: Phaser.Scene, levelNum: number): Promise<Phaser.Tilemaps.Tilemap> {
        let config = await fetch('assets/tiles.json').then(r => r.json());
        let mapDataJson = await fetch(`assets/level_${levelNum}.json`).then(r => r.json());
        config.firstgid = 1;
        mapDataJson.tilesets = [config];
        let mapData: Phaser.Tilemaps.MapData = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(
            "tiles",
            mapDataJson,
            true
        );
        let tileMap = new Phaser.Tilemaps.Tilemap(scene, mapData);
        tileMap.addTilesetImage('tiles', 'tiles');
        tileMap.createStaticLayer("Map", tileMap.getTileset("tiles"), 0, 0);
        return tileMap;
    }
}