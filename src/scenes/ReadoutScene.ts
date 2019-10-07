import { INVENTORY_HEIGHT_PX, READOUT_WIDTH_PX, READOUT_LINE_HEIGHT, READOUT_LEFT_MARGIN, READOUT_TOP_PADDING, READOUT_LEFT_RIGHT_PADDING } from '../constants';
import LevelLoader from '../levels/LevelLoader';

export default class ReadoutScene extends Phaser.Scene {
    private textArea: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "readout"
        })
    }

    public write(text: string): void {
        this.textArea.setText(text);
        this.updateHeight(text.split("\n").length);
    }

    public clear(): void {
        this.textArea.setText("");
        this.updateHeight(0);
    }

    public updateHeight(lines: number) {
        if (lines === 0) {
            this.cameras.main.setVisible(false);
            return;
        }
        if (lines < 3) {
            lines = 3; // hax
        }
        this.cameras.main.setVisible(true);
        this.cameras.main.setViewport(
            READOUT_LEFT_MARGIN,
            this.game.canvas.height - INVENTORY_HEIGHT_PX - (lines * READOUT_LINE_HEIGHT),
            READOUT_WIDTH_PX,
            lines * READOUT_LINE_HEIGHT
        );
        this.textArea.setFixedSize(READOUT_WIDTH_PX - (READOUT_LEFT_RIGHT_PADDING * 2), lines * READOUT_LINE_HEIGHT);
    }

    public create() {
        this.cameras.main.setViewport(
            READOUT_LEFT_MARGIN,
            this.game.canvas.height - INVENTORY_HEIGHT_PX - 100,
            READOUT_WIDTH_PX,
            0
        );
        LevelLoader.asyncLoadTilemap(this, "assets/readout.json").then((tileMap) => {
            this.textArea = this.add.text(READOUT_TOP_PADDING, READOUT_LEFT_RIGHT_PADDING, "", {color: "#fff"});
            this.updateHeight(0);
        });
    }
}