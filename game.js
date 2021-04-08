"use strict";

var idCounter = 0;
var playerPosition = "11-11";
var nrOfGoals = 0;
var nrOfSteps = 0;
var gamingTime = 0;
var playGround = document.getElementById("gamecontainer");
var myTimeBox = document.getElementById("gameTime");
var myStepsBox = document.getElementById("nrOfSteps");
var winBox = document.getElementById("winningBox");


function startGame()
{    
    //create tiles from tileMap01 row0
    for (var row = 0; row < tileMap01.height; row++) {

        for( var column = 0; column < tileMap01.width; column++)
        {
            var newTile = document.createElement("div");
            newTile.classList.add("tile");
            var celltype = tileMap01.mapGrid[row][column];
            //var celltype = tileMap01.mapGrid[row][column][0];
            
            if (celltype == " "){
                newTile.classList.add("Space");
            } else if (celltype == "B"){
                newTile.classList.add("Space");
                newTile.classList.add("Block");
            } else if (celltype == "G"){
                newTile.classList.add("Space");
                newTile.classList.add("Goal");
            } else if (celltype == "W"){
                newTile.classList.add("Wall");
            } else if (celltype == "P"){
                newTile.classList.add("Space");
                newTile.classList.add("Player");
                playerPosition = row + "-" + column;
            }
            newTile.id = row + "-" + column;
            playGround.appendChild(newTile);
        }
    }
    
    //check nr of goals
    nrOfGoals = document.getElementsByClassName("Goal").length;

    //show nr of steps
    myStepsBox.innerText = nrOfSteps;

    //listen on keydown
    document.addEventListener('keydown', checkKey);
}


function resetGame()
{
    //clear playground, reset counter and timer
    playGround.innerHTML = "";
    nrOfSteps = 0;
    stopTimer();
    gamingTime = 0;
    
    //remove any winner text
    winBox.style.display = "none";

    //print the game again
    startGame();

    //start timer again
    timerFunction = setInterval( myTimer, 1000);
}

function checkKey(e) { 
    //e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        moveInDirection(e, "up");
    }
    else if (e.keyCode == '40') {
        // down arrow
        moveInDirection(e, "down");
    }
    else if (e.keyCode == '37') {
        // left arrow
        moveInDirection(e, "left");
    }
    else if (e.keyCode == '39') {
        // right arrow
        moveInDirection(e, "right");
    }
}

function moveInDirection(event, direction){
    event.preventDefault();

    nrOfSteps++;
    myStepsBox.innerText = nrOfSteps;

    var nextPlayerPosition = getNextPos(direction, playerPosition);
    var playerElement = document.getElementById(playerPosition);
    var playerNextElement = document.getElementById(nextPlayerPosition);


    if(isPositionSpace(nextPlayerPosition) && !isPositionBlock(nextPlayerPosition)){
        playerNextElement.classList.add("Player");
        playerElement.classList.remove("Player");
        playerPosition = nextPlayerPosition;
    } 
    else if (isPositionBlock(nextPlayerPosition)){

        var nextBlockPosition = getNextPos(direction, nextPlayerPosition);
        var blockNextElement = document.getElementById(nextBlockPosition);
        var blockElement = document.getElementById(nextPlayerPosition);
        
        //not enough to check if space, a block also has space as well as a goal
        if(isPositionSpace(nextBlockPosition) && !isPositionBlock(nextBlockPosition) ){

            blockElement.classList.remove("Block");
            blockElement.classList.add("Player");
            playerElement.classList.remove("Player");
            blockNextElement.classList.add("Block");
            playerPosition = nextPlayerPosition;
            
            if(isPositionGoal(nextBlockPosition)) //which also has "space"
            {
                checkGameStatus();
            }
        }
    }
}

function getNextPos(direction, startPosition) {

    var separator_ind = startPosition.indexOf('-');
    var rowNr = startPosition.slice(0, separator_ind);
    var colNr = startPosition.slice(separator_ind + 1);

    if(direction == "up")
    {
        rowNr = parseInt(rowNr);
        rowNr--;
    } else if (direction == "down")
    {
        rowNr = parseInt(rowNr);
        rowNr++;     
    } else if (direction == "left")
    {
        colNr = parseInt(colNr);
        colNr--;      
    } else if (direction == "right")
    {
        colNr = parseInt(colNr);
        colNr++;
    }

    var nextPosition = rowNr + "-" + colNr;
    return nextPosition;
}

function isPositionSpace(nextPosition) {
    var nextPos = document.getElementById(nextPosition);
    return nextPos.classList.contains("Space"); 
}

function isPositionBlock(nextPosition) {
    var nextPos = document.getElementById(nextPosition);
    return nextPos.classList.contains("Block"); 
}

function isPositionGoal(nextPosition) {
    var nextPos = document.getElementById(nextPosition);
    return nextPos.classList.contains("Goal"); 
}

function checkGameStatus () {    
    var goalElements = document.getElementsByClassName("Goal");
    var blocksInGoal = 0;

    //check if goal-elements also contains blocks
    for(let g = 0; g < nrOfGoals; g++) {
        if(goalElements[g].classList.contains("Block"))
        {
            blocksInGoal++;
        }
    }
    if(blocksInGoal == nrOfGoals)
    {
        finishGame();
    }

}

function stopTimer() {
    clearInterval(timerFunction);
}

function myTimer () {
    gamingTime +=1;
    myTimeBox.innerText = gamingTime;
}

function finishGame() {
    
    stopTimer(); 
    //show a happier player
    document.getElementsByClassName("Player")[0].classList.add("HappyPlayer");
    
    //show winning text
    winBox.style.display = "block";
    var winText = document.getElementById("winText");
    winText.innerHTML = "Congratulations, you have won the game!"
    + " It took " + nrOfSteps + " steps and " + gamingTime + " seconds!";
    
    //dont allow user to move around until next start or restart
    document.removeEventListener('keydown', checkKey);
}

//initial start of game and timer
startGame();
var timerFunction = setInterval( myTimer, 1000);


