//SPRITES
//move to seprate file sprite.js
class Sprite {
    constructor(tileFrom, tileTo, timeMoved, dimensions, position, speed, health, inventory, direction, key, imgs) {
        this.tileFrom = tileFrom;
        this.tileTo = tileTo;
        this.timeMoved = timeMoved;
        this.dimensions = dimensions;
        this.position = position;
        this.speed = speed;
        this.health = health;
        this.inventory = inventory;
        this.direction = directions.down;
        this.key = key;
        this.imgs = imgs;
    }
    //places the sprite on the board
    placeAt(x, y) {
        this.tileFrom = [x, y];
        this.tileTo = [x, y];
        this.position = [((tileWidth * x) + ((tileWidth - this.dimensions[0]) / 2)),
        ((tileHeight * y) + (tileHeight - this.dimensions[1]) / 2)];
    }
    //movement method
    processMovement(t) {
        if (this.tileFrom[0] === this.tileTo[0] &&
            this.tileFrom[1] === this.tileTo[1]) {
            //not moving
            return false;
        }
        if ((t - this.timeMoved) >= this.speed) {
            //move tile and keep it from moving without user input
            this.placeAt(this.tileTo[0], this.tileTo[1]);
            var tileFloor = tileTypes[mapTileData.map[toIndex(this.tileFrom[0],
                this.tileFrom[1])].type].floor;
        } else {
            this.position[0] = (this.tileFrom[0] * tileWidth) + ((tileWidth - this.dimensions[0]) / 2);
            this.position[1] = (this.tileFrom[1] * tileHeight) + ((tileHeight - this.dimensions[1]) / 2);
            //up/down
            if (this.tileTo[0] != this.tileFrom[0]) {
                var diff = (tileWidth / this.speed) * (t - this.timeMoved);
                this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
            }
            //left/right
            if (this.tileTo[1] != this.tileFrom[1]) {
                var diff = (tileHeight / this.speed) * (t - this.timeMoved);
                this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
            }
            //smoothing movement
            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
        }
        return true;
    }
    //is this space open
    canMoveTo(x, y) {
        //if out of bounds
        if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) {
            return false;
        }
        if (mapTileData.map[toIndex(x, y)].object != null) {
            var o = mapTileData.map[toIndex(x, y)].object;
            if (objectTypes[o.type].collision == objectCollision.solid) {
                return false;
            }
        }
        //if not a path tile
        var pos = tileTypes[gameMap[toIndex(x, y)]].floor;
        switch (pos) {
            case floorTypes.path:
                return true;
                break;
            case floorTypes.solid:
                return false;
                break;
            case floorTypes.trap:
                loseHeatlth();
                console.log('ow');
                return true;
                break;
            case floorTypes.doorkey:
                //not working because the game is not detecting this floortype
                //it's registering as a path
                unlockDoor();
                return true;
                break;
            case floorTypes.lockedDoor:
                console.log('locked!')
                return false;
                break;
            case floorTypes.unlockedDoor:
                console.log("you win!")
                winGame()
                return true;
                break;
            case floorTypes.potion:
                takePotion()
                console.log('health')
                return true;
                break;
            case undefined:
                return false;
                break;
            default:
                return false;
        }
    };
    //moves the character to an available space in the corresponding direction
    canMoveUp() {
        return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
    };
    canMoveDown() {
        return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
    };
    canMoveLeft() {
        return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
    };
    canMoveRight() {
        return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
    };
    //improve timing on movement when a destination is set
    moveUp(t) {
        this.tileTo[1] -= 1; this.timeMoved = t; this.direction = directions.up;
    };
    moveDown(t) {
        this.tileTo[1] += 1; this.timeMoved = t; this.direction = directions.down;
    };
    moveLeft(t) {
        this.tileTo[0] -= 1; this.timeMoved = t; this.direction = directions.left;
    };
    moveRight(t) {
        this.tileTo[0] += 1; this.timeMoved = t; this.direction = directions.right;
    };

}