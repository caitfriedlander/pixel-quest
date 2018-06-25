// GLOBAL VARIABLES
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
// player
var player = new Sprite([1,1], [1,1], 0, [15, 15], [30,30], 600, 3);

//game map modeled as an array
var gameMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
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
	0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

//refactor as class
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
        // movement method
    }
    placeAt(x,y) {
        this.tileFrom = [x,y];
        this.tileTo = [x,y];
        this.position = [((tileWidth * x) + ((tileWidth - this.dimensions[0])/2)), 
        ((tileHeight * y) + (tileHeight - this.dimensions[1])/2)];
    }
};

//inventory
var inventoryArr = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
];

//health

//tile types

// EVENT HANDLERS


// FUNCTIONS
//rewrite as initialize 
window.onload = function() {
    //starts the loop
    ctx = document.getElementById('game').getContext("2d");
    requestAnimationFrame(drawGame);
    // ctx.font = "bold 10pt sans-serif";

    //sprite motion function
        //player
        //enemy

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
        //frame counter
        var sec = Math.floor(Date.now()/1000);
        if(sec!=currentSecond)
        {
            currentSecond = sec;
            framesLastSecond = frameCount;
            frameCount =1;
        }
        else {
            frameCount++;
        }
        //drawing loops: traverse the array row by row and finds each collumn index inside
        for (var y = 0; y < mapHeight; y++) {
            for (var x = 0; x < mapWidth; x++) {
                if (gameMap[((y*mapWidth)+x)] === 0) {
                    ctx.fillStyle = "#000000";
                } else {
                    ctx.fillStyle = "lightblue";
                }
                ctx.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight)
            }
        }

        //sprite render function

        //win logic

        //lose logic
        
        ctx.fillStyle = "#ff0000";
        // ctx.fillText(framesLastSecond, 10, 20);
        requestAnimationFrame(drawGame);
        // if (!winner) requestAnimationFrame(drawGame);
    }

};

