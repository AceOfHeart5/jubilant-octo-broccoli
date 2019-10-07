import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';

export class Altar extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return this.active;
    }

    // You should win if you run into this and go to the next level

    public recItem(item: string): boolean {
        if (this.active) {
            (this.scene as GameScene).nextLevel();
            this.destroy();
            return true;
        }
        return false;
    }
}