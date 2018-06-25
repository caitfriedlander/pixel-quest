// GLOBAL VARIABLES
var ctx = null;
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
//tile width/height
var tileWidth = 30, tileHeight = 30;
//map width/height
var mapWidth = 20, mapHeight = 20;
//counts frames to make sure the loop is working
var currentSecond = 0, frameCount = 0, framesLastSecond = 0;

// player
var player = new Sprite();

function Sprite() {
    this.tileFrom = [1,1];
    this.tileTo = [1,1];
    this.timeMoved = 0;
    this.dimensions = [15, 15];
    this.position = [45,45];
    this.speed = 600;
    this.health = 3;
    // inventory, direction facing, movement method
}

//inventory
var inventory = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
];

//health

//tile types

// EVENT HANDLERS

var keysDown = {
    37: false,
    38: false,
    39: false,
    40: false
}

// FUNCTIONS
window.onload = function()
{
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
    }

};