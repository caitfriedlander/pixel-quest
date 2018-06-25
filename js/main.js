// GLOBAL VARIABLES (State)
var ctx = null;
//tile width/height
var tileWidth = 30, tileHeight = 30;
//map width/height
var mapWidth = 20, mapHeight = 20;
//counts frames to make sure the loop is working
var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
//last time a frame was drawn
var lastFrameTime = 0;
//Arrow Keys
var keysDown = {
    37: false,
    38: false,
    39: false,
    40: false
}

//game map modeled as an array
var gameMap = [
    0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
	0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0,
	0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0,
    0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0,
    0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
	0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0,
	0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
	0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
	0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
	0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 3,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

var floorTypes = {
    solid: 0,
    path: 1,
    door: 2
}

var tileTypes = {
    0: {color: "#9bcfc2", floor: floorTypes.solid},
    1: {color: "#ADD8E6", floor: floorTypes.path},
    2: {color: "#c2cf9b", floor: floorTypes.solid},
    3: {color: "#c2cf9b", floor: floorTypes.door}
}

//Sprite Class
class Sprite {
    constructor(tileFrom, tileTo, timeMoved, dimensions, position, speed, health, inventory, direction) {
        this.tileFrom = tileFrom;
        this.tileTo = tileTo;
        this.timeMoved = timeMoved;
        this.dimensions = dimensions;
        this.position = position;
        this.speed = speed;
        this.health = health;
        this.inventory = inventory;
        this.direction = direction;
    }
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
        //if not a path tile
        if (tileTypes[gameMap[toIndex(x,y)]].floor != floorTypes.path) {
            return false;
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
        this.tileTo[1] -= 1; this.timeMoved = t;
    };
    moveDown(t){
        this.tileTo[1] += 1; this.timeMoved = t;
    };
    moveLeft(t){
        this.tileTo[0] -= 1; this.timeMoved = t;
    };
    moveRight(t){
        this.tileTo[0] += 1; this.timeMoved = t;
    };

};

//Helper Function for finding EXACT position in the gameMap array
function toIndex(x,y) {
    return ((y * mapWidth) + x);
}

// player
var player = new Sprite([1,1], [1,1], 0, [20, 20], [35,35], 400, 3);

// enemies
    //create an array of enemy objects to be looped through later
    //each enemy needs a unique starting position and a movement method

//inventory
var inventoryArr = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
];

//health

//tile types

// EVENT HANDLERS (GLOBAL)


// FUNCTIONS
//rewrite as initialize 
window.onload = function() {
    //starts the loop
    ctx = document.getElementById('game').getContext("2d");
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

};

//inventory function
    //if player character position === item position
        // pickup function
            //remove item from board
            //place in inventory

//health function

//main function
function drawGame() {
    if(ctx === null) {
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
                
    //Render board
    for (var y = 0; y < mapHeight; y++) {
        for (var x = 0; x < mapWidth; x++) {
            ctx.fillStyle = tileTypes[gameMap[toIndex(x,y)]].color;
            ctx.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight)
        }
    }

    //render player
    ctx.fillStyle = "#cf9bc2";
    ctx.fillRect(player.position[0], player.position[1], 
        player.dimensions[0], player.dimensions[1]);

    //win logic

    //lose logic
    
    ctx.fillStyle = "#ff0000";
    // ctx.fillText(framesLastSecond, 10, 20);
    lastFrameTime = currentFrameTime;
    requestAnimationFrame(drawGame);
    // if (!winner) requestAnimationFrame(drawGame);
};


