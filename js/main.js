// GLOBAL VARIABLES
var ctx = null;
//game map modeled as an array
var gameMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
	0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 1, 0, 0, 0, 1, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 0, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
	0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
//tile width/height
var tileWidth = 40, tileHeight = 40;
//map width/height
var mapWidth = 10, mapHeight = 10;
//counts frames to make sure the loop is working
var currentSecond = 0, frameCount = 0, framesLastSecond = 0;

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
                    ctx.fillStyle = "#ccffcc";
                }
                ctx.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight)
            }
        }
        
        ctx.fillStyle = "#ff0000";
        // ctx.fillText("FPS: " + framesLastSecond, 10, 20);
        requestAnimationFrame(drawGame);
    }

};