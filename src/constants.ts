export const READOUT_WIDTH_PX = 32 * 15;
export const INVENTORY_HEIGHT_PX = 240;
export const GAME_WORLD_TILE_WIDTH = 32;  //pixels
export const GAME_WORLD_TILE_HEIGHT = 32;  //pixels
export const MOVE_DELAY = 100; //ms
export const LETTER_HOLDER_SIZE = 45; // pixels
export const LETTER_HOLDER_TOP_MARGIN = -5;
export const LETTER_HOLDER_LEFT_MARGIN = -5;
export const LETTER_LEFT_MARGIN = 64;
export const READOUT_LEFT_MARGIN = 32;
export const READOUT_TOP_PADDING = 32;
export const READOUT_LEFT_RIGHT_PADDING = 32;
export const READOUT_LINE_HEIGHT = 32;

export const INVENTORY_TOP = 32;
export const ITEM_TOP = 128;

export enum ItemResolutionResponse {
    NONE,
    DESTROY,
    PASS_THROUGH,
    CREATE_LETTER_L,
    CREATE_LETTER_X,
    CREATE_LETTER_Y,
    CREATE_LETTER_O,
    CREATE_LETTER_S,
    PRINT_TEXT,
    SLIP
}

export enum MoveDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
