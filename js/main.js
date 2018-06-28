/* GLOBAL VARIABLES (State) */
var ctx = null;
var player;
var score = 0;
var winner = false;
var running;
var playerPos;
//Arrow Keys
var keysDown = { 37: false, 38: false, 39: false, 40: false }
//counts frames to make sure the loop is working
var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
//last time a frame was drawn
var lastFrameTime = 0;
//tile width/height
var tileWidth = 30, tileHeight = 30;
//map width/height
var mapWidth = 20, mapHeight = 20;

/* Cached Elements */
var canvas = document.querySelector('canvas');
var tileset = null;
var tilesetURL = "images/pixel-quest-imgs-small.png";
var tilesetLoaded = false;

//GAME MAP
var gameMap = [
    1, 9, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 6, 1,
    1, 2, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1,
    1, 2, 1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 6, 1, 2, 1, 0, 1, 2, 3, 2, 2, 1, 0, 1, 2, 2, 1, 0, 3, 1,
    1, 2, 0, 0, 0, 2, 0, 0, 2, 1, 0, 0, 2, 0, 0, 0, 0, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 0, 1, 0, 1, 2, 2, 1, 2, 0, 0, 1, 0, 0, 0, 1, 2, 1,
    1, 3, 1, 2, 0, 2, 0, 0, 0, 0, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1,
    1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 1, 2, 1,
    1, 2, 1, 2, 2, 2, 2, 2, 1, 0, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1,
    1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1,
    1, 2, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
    1, 3, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1,
    1, 2, 1, 2, 1, 0, 1, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1,
    1, 2, 1, 2, 0, 2, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 0, 2, 0, 1,
    1, 2, 0, 0, 1, 0, 0, 2, 0, 0, 2, 2, 3, 2, 2, 0, 2, 2, 2, 1,
    1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 3, 2, 3, 2, 2, 2, 1, 2, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0
];

var mapTileData = new TileMap();

var floorTypes = { solid: 0, path: 1, lockedDoor: 2, unlockedDoor: 3, trap: 4, doorkey: 5, loot: 6 }

var tileTypes = {
    //horizontal walls
    0: { floor: floorTypes.solid, img: [{ x: 64, y: 128, w: 64, h: 64 }] },
    //vertical walls
    1: { floor: floorTypes.solid, img: [{ x: 128, y: 128, w: 64, h: 64 }] },
    //regular floor
    2: { floor: floorTypes.path, img: [{ x: 0, y: 0, w: 64, h: 64 }] },
    //trapped floor
    3: {
        floor: floorTypes.trap, img: [{ x: 64, y: 0, w: 64, h: 64, d: 1500 },
        { x: 128, y: 0, w: 64, h: 64, d: 1500 }]
    },
    //locked door
    4: { floor: floorTypes.lockedDoor, img: [{ x: 64, y: 64, w: 64, h: 64 }] },
    //unlocked door
    5: { floor: floorTypes.unlockedDoor, img: [{ x: 0, y: 64, w: 64, h: 64 }] },
    //doorkey
    6: { floor: floorTypes.doorkey, img: [{ x: 128, y: 64, w: 64, h: 64 }] },
    //potion
    7: { floor: floorTypes.loot, img: [{ x: 128, y: 64, w: 64, h: 64 }] },
    //gold
    8: { floor: floorTypes.loot, img: [{ x: 128, y: 64, w: 64, h: 64 }] },
    //door
    9: { floor: floorTypes.solid, img: [{ x: 64, y: 64, w: 64, h: 64 }] }
}

var directions = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
}

//SPRITES
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
        //if ocupied by an enemy
        //collision detection here

        //if not a path tile
        var pos = tileTypes[gameMap[toIndex(x, y)]].floor;
        console.log(pos);
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
            case floorTypes.loot:
                return true;
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

};

// player
player = new Sprite([1, 1], [1, 1], 0, [20, 20], [35, 35], 400, 3);
player.imgs = {}
player.imgs[directions.up] = [{ x: 240, y: 145, w: 49, h: 49 }];
player.imgs[directions.right] = [{ x: 240, y: 96, w: 49, h: 49 }];
player.imgs[directions.down] = [{ x: 191, y: 96, w: 49, h: 49 }];
player.imgs[directions.left] = [{ x: 191, y: 145, w: 49, h: 49 }];

// enemies //animation not working
var e1 = new Sprite([1, 3], [1, 3], 0, [20, 20], [95, 35], 600);
e1.imgs = [{ x: 273, y: 0, w: 43, h: 24, d: 200 },
{ x: 316, y: 0, w: 43, h: 24, d: 200 }, { x: 359, y: 0, w: 43, h: 24, d: 200 }];
var e2 = new Sprite([1, 3], [1, 3], 0, [20, 20], [365, 275], 600);
e2.imgs = [{ x: 273, y: 0, w: 43, h: 24, d: 200 },
{ x: 316, y: 0, w: 43, h: 24, d: 200 }, { x: 359, y: 0, w: 43, h: 24, d: 200 }];

//create an array of enemy objects to be looped through later
var enemies = [e1, e2];

//LOOT
var objectCollision = {
    none: 0,
    solid: 1
}

var objectTypes = {
    1: {
        name: 'gold',
        img: [{ x: 191, y: 145, w: 49, h: 49 }],
        collision: objectCollision.none
    },
    2: {
        name: 'potion',
        img: [{ x: 191, y: 145, w: 49, h: 49 }],
        collision: objectCollision.none
    },
    3: {
        name: 'key',
        img: [{ x: 191, y: 145, w: 49, h: 49 }],
        collision: objectCollision.none
    }
}

function MapObject(type) {
    this.x = 0;
    this.y = 0;
    this.type = type;
    this.object = object;
}

MapObject.prototype.placeAt = function (newX, newY) {
    if (mapTileData.map[toIndex(this.x, this.y)].object == this) {
        mapTileData.map[toIndex(this.x, this.y)].object = null;
    }
    this.x = newX;
    this.y = newY;
    mapTileData.map[toIndex(newX, newY)].object = this;
};

//this isn't working
// var mo1 = new MapObject(1); mo1.placeAt(2, 4);
// var mo2 = new MapObject(2); mo2.placeAt(2, 3);

//inventory
var inventoryArr = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
];

/* EVENT HANDLERS (GLOBAL) */

//start button
document.getElementById('start').addEventListener('click', startGame)

//restart button
document.getElementById('restart').addEventListener('click', restartGame)


/* FUNCTIONS */

//Helper Function for finding EXACT position in the gameMap array
function toIndex(x, y) {
    return ((y * mapWidth) + x);
}

function Tile(tx, ty, tt) {
    this.x = tx;
    this.y = ty;
    this.type = tt;
    this.object = null;
}

function TileMap() {
    this.map = [];
    this.w = 0;
    this.h = 0;
}

TileMap.prototype.buildMapFromData = function (d, w, h) {
    this.w = w;
    this.h = h;

    if (d.length != (w * h)) { return false; }

    this.map.length = 0;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            this.map.push(new Tile(x, y, d[((y * w) + x)]));
        }
    }

    return true;
};

//find exact player position
function playerFinder(player) {
    playerPos = toIndex(player.position[0], player.position[1]);
}

//unlock door function

function unlockDoor() {
    //not working
    player.key = true;
    //locked doors unlock
    floorTypes.lockedDoor = floorTypes.unlockedDoor;
    floorTypes.doorkey = floorTypes.path;
    tileTypes[4].img = [{ x: 0, y: 64, w: 64, h: 64 }];
    tileTypes[6].img = [{ x: 0, y: 0, w: 64, h: 64 }];
    console.log("I'm unlocked!");
}


//Animated Sprite function
function getFrame(img, durration, time, animated) {

    if (!animated) {
        return img[0];
    }
    time = time % durration;
    for (x in img) {
        if (img[x].end >= time) {
            return img[x];
        }
    }

};

//Initialize function
function initialize() {
    //set upstate with start game button and default UI 
    //(empty inventory, full health, 0 score, null key)
    player.inventory = [],
        player.health = 3;
    player.key = false;
    score = 0;
    player.position = player.position;
    running = false;
};

function startGame() {
    //starts the loop
    running = true;
    ctx = document.getElementById('game').getContext("2d");
    /*  I need to refactor the code so that tile width and height 
        have px after them but that doesn't disrupt the flow of the code
        document.getElementById('game').style.width= '600px';
        document.getElementById('game').style.height= '600px'; */

    tileset = new Image();
    tileset.onerror = function () {
        ctx = null;
        alert("failed to load tileset");
    };

    tileset.onload = function () {
        tilesetLoaded = true;
    }

    tileset.src = tilesetURL;

    for (x in tileTypes) {
        tileTypes[x]['animated'] = tileTypes[x].img.length > 1 ? true : false;

        if (tileTypes[x].animated) {
            var t = 0;

            for (i in tileTypes[x].img) {
                tileTypes[x].img[i]['start'] = t;

                t += tileTypes[x].img[i].d;
                tileTypes[x].img[i]['end'] = t;
            }
            tileTypes[x]['durration'] = t;
        }
    };

    mapTileData.buildMapFromData(gameMap, mapWidth, mapHeight);
    mapTileData.map[((2 * mapWidth) + 2)].eventEnter = function () { console.log("Entered tile 2,2"); };

    requestAnimationFrame(drawGame);
    // ctx.font = "bold 10pt sans-serif";

    //Event Handlers (Game)
    window.addEventListener("keydown", function (evt) {
        if (evt.keyCode >= 37 && evt.keyCode <= 40) {
            keysDown[evt.keyCode] = true;
        }
    });
    window.addEventListener("keyup", function (evt) {
        if (evt.keyCode >= 37 && evt.keyCode <= 40) {
            keysDown[evt.keyCode] = false;
        }
    })
}

function restartGame() {
    initialize();
    startGame();
}

//inventory function
//if player character position === item position
// pickup function
//remove item from board
//place in inventory

//health functions

function loseHeatlth() {
    if (player.health <= 1) {
        loseGame()

    } else {
        player.health -= 1;
        return true;
    }
}

function gainHealth() {
    if (player.health > 3) {
        player.health += 1;
    }
}


//win logic
function winGame() {
    //launch win message
    ctx = null;
    ctx = document.getElementById('game').getContext("2d");
    document.getElementById('game').style.width = '600px';
    document.getElementById('game').style.height = '600px';
    console.log('you win!');
    ctx.fillStyle = 'pink';
    ctx.fillRect(0, 0, 600, 600)
    winner = true;
    running = false;
    gameMap = [];
    player.position = [];
    enemies = [];

}

//lose logic
function loseGame() {
    ctx = null;
    ctx = document.getElementById('game').getContext("2d");
    document.getElementById('game').style.width = '600px';
    document.getElementById('game').style.height = '600px';
    console.log('you lose!');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 600, 600)
    running = false;
    gameMap = [];
    player.position = [];
    enemies = [];
}

//main function
function drawGame() {
    if (ctx === null) {
        return;
    }
    if (!tilesetLoaded) {
        requestAnimationFrame(drawGame);
        return;
    }

    var currentFrameTime = Date.now();
    // var timeElapsed = currentFrameTime - lastFrameTime;

    //frame counter
    var sec = Math.floor(Date.now() / 1000);
    if (sec != currentSecond) {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else {
        frameCount++;
    }

    //Render board
    if (winner !== true) {
        for (var y = 0; y < mapHeight; y++) {
            for (var x = 0; x < mapWidth; x++) {
                var tile = tileTypes[mapTileData.map[toIndex(x, y)].type];
                var img = getFrame(tile.img, tile.durration, currentFrameTime, tile.animated);
                ctx.drawImage(tileset, img.x, img.y, img.w, img.h, (x * tileWidth), (y * tileHeight),
                    tileWidth, tileHeight);
            }
        }

        //check to see if player is moving
        if (!player.processMovement(currentFrameTime)) {
            if (keysDown[38] && player.canMoveUp()) {
                player.moveUp(currentFrameTime)
            } else if (keysDown[40] && player.canMoveDown()) {
                player.moveDown(currentFrameTime)
            } else if (keysDown[37] && player.canMoveLeft()) {
                player.moveLeft(currentFrameTime)
            } else if (keysDown[39] && player.canMoveRight()) {
                player.moveRight(currentFrameTime)
            }
        }

        //render player
        var playerImg = player.imgs[player.direction];
        ctx.drawImage(tileset, playerImg[0].x, playerImg[0].y, playerImg[0].w, playerImg[0].h,
            player.position[0], player.position[1], player.dimensions[0], player.dimensions[1]);

        //render enemies

        enemies.forEach(function (e) {
            var enemy = e;
            var enemyImg = enemy.imgs;
            ctx.drawImage(tileset, enemyImg[0].x, enemyImg[0].y, enemyImg[0].w, enemyImg[0].h,
                enemy.position[0], enemy.position[1], enemy.dimensions[0], enemy.dimensions[1]);
        });

        ctx.fillStyle = "#ff0000";
        // ctx.fillText(framesLastSecond, 10, 20);
        lastFrameTime = currentFrameTime;
        // requestAnimationFrame(drawGame);
        if (running == true) requestAnimationFrame(drawGame);
    };
}

initialize();
