/* GLOBAL VARIABLES (State) */
var ctx = null;
var player;
var score = 0;
var winner = false;
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
    1, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
	1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1,
	1, 2, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1,
	1, 2, 1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
	1, 2, 1, 2, 1, 0, 1, 2, 3, 2, 2, 1, 0, 1, 2, 2, 1, 0, 3, 1,
	1, 2, 0, 0, 0, 2, 0, 0, 2, 1, 0, 0, 2, 0, 0, 0, 0, 2, 2, 1,
	1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
	1, 2, 1, 0, 1, 0, 1, 2, 2, 1, 2, 0, 0, 1, 0, 0, 0, 1, 2, 1,
	1, 2, 1, 2, 0, 2, 0, 0, 0, 0, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1,
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

var tileEvents = {

}

var floorTypes = { solid: 0, path: 1, lockedDoor: 2, unlockedDoor: 3 }

var tileTypes = {
    //horizontal walls
    0: {color: "#9bcfc2", floor: floorTypes.solid, img: [{x:64, y:128, w:64, h:64}]},
    //vertical walls
    1: {color: "#9bcfc2", floor: floorTypes.solid, img: [{x:128, y:128, w:64, h:64}]},
    //regular floor
    2: {color: "#ADD8E6", floor: floorTypes.path, img: [{x:0, y:0, w:64, h:64}]},
    //trapped floor
    3: {color: "#c2cf9b", floor: floorTypes.path, img: [{x:64, y:0, w:64, h:64, d:600}, {x:128, y:0, w:64, h:64, d:600}]},
    //locked door
    4: {color: "#c2cf9b", floor: floorTypes.lockedDoor, img: [{x:64, y:64, w:64, h:64}]},
    //unlocked door
    5: {color: "#c2cfcf", floor: floorTypes.unlockedDoor, img: [{x:0, y:64, w:64, h:64}]}
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
        this.imgs =imgs;
    }
    //image methods

    //places the sprite on the board
    placeAt(x,y) {
        this.tileFrom = [x,y];
        this.tileTo = [x,y];
        this.position = [((tileWidth * x) + ((tileWidth - this.dimensions[0])/2)), 
        ((tileHeight * y) + (tileHeight - this.dimensions[1])/2)];
    }
    //movement method
    processMovement(t) {
        if (this.tileFrom[0] === this.tileTo[0] && 
            this.tileFrom[1] === this.tileTo[1]) {
                //not moving
                return false;
            }
            if ((t-this.timeMoved) >= this.speed) {
                //move tile and keep it from moving without user input
                this.placeAt(this.tileTo[0], this.tileTo[1]);
            } else {
                this.position[0] = (this.tileFrom[0] * tileWidth) + ((tileWidth - this.dimensions[0])/2);
                this.position[1] = (this.tileFrom[1] * tileHeight) + ((tileHeight - this.dimensions[1])/2);
                //up/down
                if (this.tileTo[0] != this.tileFrom[0]) {
                    var diff =  (tileWidth / this.speed) * (t-this.timeMoved);
                    this.position[0]+= (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
                }
                //left/right
                if (this.tileTo[1] != this.tileFrom[1]) {
                    var diff =  (tileHeight / this.speed) * (t-this.timeMoved);
                    this.position[1]+= (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
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
        //if ocupied by an enemy
        
        //if not a path tile
        if (tileTypes[gameMap[toIndex(x,y)]].floor != floorTypes.path) {
            if (tileTypes[gameMap[toIndex(x,y)]].floor != floorTypes.unlockedDoor) {
                return false;
            } else {
                //run winfunction
                winGame();
                return true;
            }
        }
        return true;
    };
    //moves the character to an available space in the corresponding direction
    canMoveUp() {
        return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]-1);
    };
    canMoveDown() {
        return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]+1);
    };
    canMoveLeft() {
        return this.canMoveTo(this.tileFrom[0]-1, this.tileFrom[1]);
    };
    canMoveRight() {
        return this.canMoveTo(this.tileFrom[0]+1, this.tileFrom[1]);
    };
    //improve timing on movement when a destination is set
    moveUp(t){
        this.tileTo[1] -= 1; this.timeMoved = t; this.direction = directions.up;
    };
    moveDown(t){
        this.tileTo[1] += 1; this.timeMoved = t; this.direction = directions.down;
    };
    moveLeft(t){
        this.tileTo[0] -= 1; this.timeMoved = t; this.direction = directions.left;
    };
    moveRight(t){
        this.tileTo[0] += 1; this.timeMoved = t; this.direction = directions.right;
    };
    
};
    
// player
player = new Sprite([1,1], [1,1], 0, [20, 20], [35,35], 400, 3);
player.imgs = {}
player.imgs[directions.up] = [{x:240, y:145, w:49, h:49}];
player.imgs[directions.right] = [{x:240, y:96, w:49, h:49}];
player.imgs[directions.down] = [{x:191, y:96, w:49, h:49}];
player.imgs[directions.left] = [{x:191, y:145, w:49, h:49}];

// enemies
var e1 = new Sprite([1,3], [1,3], 0, [20, 20], [95,35], 600);
var e2 = new Sprite([1,3], [1,3], 0, [20, 20], [365, 275], 600);
var e3 = new Sprite([1,3], [1,3], 0, [20, 20], [545, 455], 600);
var e4 = new Sprite([1,3], [1,3], 0, [20, 20], [155, 355], 600);
var e5 = new Sprite([1,3], [1,3], 0, [20, 20], [65, 545], 600);
var e6 = new Sprite([1,3], [1,3], 0, [20, 20], [305, 95], 600);

//create an array of enemy objects to be looped through later
var enemies = [e1, e2];

//each enemy needs a unique starting position and a movement method

//LOOT
var objectCollision = {
    none: 0,
    solid: 1
}
var objectTypes = {
    1: {
        name: 'gold',

    }
}

class Loot {
    constructor(dimensions, position, type, inInventory) {
        this.dimensions = dimensions;
        this.position = position;
        this.type = type;
        this.inInventory = false;
    }
}

var lootType = {
    1: {label: "apple", purpose: "heal", color: "green"},
    2: {label: "gold", purpose: "score increase", color: "yellow"}
}


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
function toIndex(x,y) {
    return ((y * mapWidth) + x);
}

//Initialize function
function initialize() {
    //set upstate with start game button and default UI 
    //(empty inventory, full health, 0 score, null key)
    player.inventory = [],
    player.health = 3;
    player.key = false;
    score = 0;
    player.position = player.position;

};

function startGame() {
    //this should be a separate startGame function
    //starts the loop
    ctx = document.getElementById('game').getContext("2d");
    // I need to refactor the code so that tile width and height 
    //have px after them but that doesn't disrupt the flow of the code
    // document.getElementById('game').style.width= '600px';
    // document.getElementById('game').style.height= '600px';

    tileset = new Image();
    tileset.onerror = function() {
        ctx = null;
        alert("failed to load tileset");
    };

    tileset.onload = function() {
       tilesetLoaded = true;
    }

    tileset.src = tilesetURL;

    requestAnimationFrame(drawGame);
    // ctx.font = "bold 10pt sans-serif";

    //Event Handlers (Game)
    window.addEventListener("keydown", function(evt) {
        if (evt.keyCode >= 37 && evt.keyCode <= 40) {
            keysDown[evt.keyCode] = true;
        }
    });
    window.addEventListener("keyup", function(evt) {
        if (evt.keyCode >= 37 && evt.keyCode <= 40) {
            keysDown[evt.keyCode] = false;
        }
    })
}

function resetLevel() {
//reset score, health, loot, enemies, and inventory to the way 
//they were when the level started
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

//health function

function loseHeatlth() {
    player.health -= 1;
}

function gainHealth() {
    if (player.health >3) {
        player.health +=1;
    }
}

   
//win logic
function winGame() {
    //launch win message
    console.log('you win!');
    ctx.fillStyle = 'pink';
    ctx.fillRect(0, 0, 600, 600)
    winner = true;
    gameMap =[];
    player.position = [];
    enemies = [];

}

//lose logic
function loseGame() {
}

//main function
function drawGame() {
    if(ctx === null) {
        return;
    }
    if (!tilesetLoaded) {
        requestAnimationFrame(drawGame); 
        return;
    }

    var currentFrameTime = Date.now();
    var timeElapsed = currentFrameTime - lastFrameTime;

    //frame counter
    var sec = Math.floor(Date.now()/1000);
    if(sec!=currentSecond)
    {
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
            // ctx.fillStyle = tileTypes[gameMap[toIndex(x,y)]].color;
            // ctx.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight)
            var tile = tileTypes[gameMap[toIndex(x,y)]];
            ctx.drawImage(tileset, tile.img[0].x, tile.img[0].y, 
                tile.img[0].w, tile.img[0].h, (x*tileWidth), (y*tileHeight),
				tileWidth, tileHeight);
            }
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
    // ctx.fillStyle = "#cf9bc2";
    // ctx.fillRect(player.position[0], player.position[1], 
    //     player.dimensions[0], player.dimensions[1]);
    var playerImg = player.imgs[player.direction];
    ctx.drawImage(tileset, playerImg[0].x, playerImg[0].y, playerImg[0].w, playerImg[0].h,
		player.position[0], player.position[1], player.dimensions[0], player.dimensions[1]);
    //render enemies

    enemies.forEach(function(e) {
        ctx.fillStyle = "red";
        ctx.fillRect(e.position[0], e.position[1], 
            e.dimensions[0], e.dimensions[1]);
        });

        ctx.fillStyle = "#ff0000";
        // ctx.fillText(framesLastSecond, 10, 20);
        lastFrameTime = currentFrameTime;
        // requestAnimationFrame(drawGame);
        if (!winner) requestAnimationFrame(drawGame);
    };
 

startGame();
initialize();
