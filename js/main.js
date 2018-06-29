/* CONSTANTS*/
var keysDown = { 37: false, 38: false, 39: false, 40: false };
var floorTypes = { solid: 0, path: 1, lockedDoor: 2, unlockedDoor: 3, trap: 4, doorkey: 5, potion: 6 };
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
    7: { floor: floorTypes.potion, img: [{ x: 294, y: 128, w: 64, h: 64 }] },
    //door
    8: { floor: floorTypes.solid, img: [{ x: 64, y: 64, w: 64, h: 64 }] }
};
/* GLOBAL VARIABLES (State) */
var ctx = null;
var player;
var running;
var panel = 'S';
var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
var lastFrameTime = 0;
var tileWidth = 30, tileHeight = 30;
var mapWidth = 20, mapHeight = 20;
var tileset = null;
var tilesetLoaded = false;
var levels = [level0, level1, level2];
var currentLevel = 0;

//Game Map Constants
var gameMap = levels[currentLevel];

var mapTileData = new TileMap();

var directions = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
};

/* Cached Elements */
var button = document.getElementById('button');
var canvas = document.querySelector('canvas');
var levelDisplay = document.getElementById('level');
var healthDisplay = document.getElementById('health');
var tilesetURL = "images/pixel-quest-imgs-small.png";
var startEl = document.getElementById('start');
var winEl = document.getElementById('win');
var loseEl = document.getElementById('lose');


// PLAYER
player = new Sprite([1, 1], [1, 1], 0, [20, 20], [35, 35], 400, 3);
player.imgs = {}
player.imgs[directions.up] = [{ x: 240, y: 145, w: 49, h: 49 }];
player.imgs[directions.right] = [{ x: 240, y: 96, w: 49, h: 49 }];
player.imgs[directions.down] = [{ x: 191, y: 96, w: 49, h: 49 }];
player.imgs[directions.left] = [{ x: 191, y: 145, w: 49, h: 49 }];

//object collisions
var objectCollision = {
    none: 0,
    solid: 1
}

/* EVENT HANDLERS (GLOBAL) */
button.addEventListener('click', btnClickHandler)

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

/* FUNCTIONS */

//button click handler
function btnClickHandler() {
    if (button.textContent == "Next Level") {
        resetGame();
    } else if (button.textContent = "Try Again") {
        resetGame();

    } else if (button.textContent = "Start Game") {
        startGame();
    }
    render();
}

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
    this.object = null;
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

function unlockDoor() {
    //not working
    //locked doors unlock
    tileTypes[4].floor = floorTypes.unlockedDoor;
    tileTypes[6].floor = floorTypes.path;
    tileTypes[4].img = [{ x: 0, y: 64, w: 64, h: 64 }];
    tileTypes[6].img = [{ x: 0, y: 0, w: 64, h: 64 }];
    console.log("I'm unlocked!");
}

function takePotion() {
    player.health += 1;
    tileTypes[7].floor = floorTypes.path;
    tileTypes[7].img = [{ x: 0, y: 0, w: 64, h: 64 }];
}

function loseHeatlth() {
    if (player.health <= 1) {
        loseGame()

    } else {
        player.health -= 1;
        return true;
    }
}

//GAME STATE FUNCTIONS
function resetGame() {
    gameMap = levels[currentLevel];
    running = true;
    player = new Sprite([1, 1], [1, 1], 0, [20, 20], [35, 35], 400, 3);
    player.imgs = {}
    player.imgs[directions.up] = [{ x: 240, y: 145, w: 49, h: 49 }];
    player.imgs[directions.right] = [{ x: 240, y: 96, w: 49, h: 49 }];
    player.imgs[directions.down] = [{ x: 191, y: 96, w: 49, h: 49 }];
    player.imgs[directions.left] = [{ x: 191, y: 145, w: 49, h: 49 }];
    startGame();
    initialize();
}

function winGame() {
    console.log('you win!');
    panel = 'W';
    running = false;
    player = new Sprite([1, 1], [1, 1], 0, [20, 20], [35, 35], 400, 3);
    player.imgs = {}
    player.imgs[directions.up] = [{ x: 240, y: 145, w: 49, h: 49 }];
    player.imgs[directions.right] = [{ x: 240, y: 96, w: 49, h: 49 }];
    player.imgs[directions.down] = [{ x: 191, y: 96, w: 49, h: 49 }];
    player.imgs[directions.left] = [{ x: 191, y: 145, w: 49, h: 49 }];
    if (currentLevel < levels.length - 1) currentLevel += 1;
    render();
}

function loseGame() {
    console.log('you lose!');
    panel = 'L';
    running = false;
    player = new Sprite([1, 1], [1, 1], 0, [20, 20], [35, 35], 400, 3);
    player.imgs = {}
    player.imgs[directions.up] = [{ x: 240, y: 145, w: 49, h: 49 }];
    player.imgs[directions.right] = [{ x: 240, y: 96, w: 49, h: 49 }];
    player.imgs[directions.down] = [{ x: 191, y: 96, w: 49, h: 49 }];
    player.imgs[directions.left] = [{ x: 191, y: 145, w: 49, h: 49 }];
    render();
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

/*ONLOAD*/
function initialize() {
    player.health = 3;
    running = false;
    render();
};

/*GAME START*/
function startGame() {
    //starts the loop
    ctx = document.getElementById('game').getContext("2d");
    panel = 'C';
    running = true;
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
}

/* CANVAS RENDERING */
function drawGame() {
    if (ctx === null) {
        return;
    }
    if (!tilesetLoaded) {
        requestAnimationFrame(drawGame);
        return;
    }

    var currentFrameTime = Date.now();

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
    if (running !== true) {
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

        ctx.fillStyle = "#ff0000";
        // ctx.fillText(framesLastSecond, 10, 20);
        lastFrameTime = currentFrameTime;
        // requestAnimationFrame(drawGame);
        if (!running) requestAnimationFrame(drawGame);
        render()
    };
}

/* DOM RENDERING */
function render() {

    switch (panel) {
        case 'C':
        button.style.display = 'none';
        break;
        case 'S':
        button.textContent = "Start Game";
        button.style.display = 'block';
        break;
        case 'W':
            button.style.display = currentLevel === (levels.length -1) ? 'none' : 'block';
            button.textContent = "Next Level";
            break;
        case 'L':
            button.textContent = "Try Again!"
            button.style.display = 'block';
            break;
    }

    canvas.style.display = panel === 'C' ? 'block' : 'none';
    startEl.style.display = panel === 'S' ? 'block' : 'none';
    winEl.style.display = panel === 'W' ? 'block' : 'none';
    loseEl.style.display = panel === 'L' ? 'block' : 'none';
    levelDisplay.textContent = currentLevel + 1;
    healthDisplay.textContent = player.health;
}

render();
initialize();
