"use strict"
const GRID_SIZE = 20;
var score = 1, highscore = 0;
var stage, queue, preloadText, food, poison, snakeHead, isDead;
var tail = [];

//function that preloads the audio files
function preload() {
    //Create a stage based on the canvas properties in index.html for displaying all the elements.
    stage = new createjs.Stage('canvas');
    //Loading screen. Not really useful since program is loading fast.
    preloadText = new createjs.Text("Loading: ", "20px pixelFont", "#000");
    stage.addChild(preloadText);
    //Loads assets to the variable queue.
    queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.on('progress', progress);
    queue.on('complete', start);
    queue.loadManifest([{
        id: 'eatSound',
        src: 'assets/eat.wav'
    },{
        id: 'deathSound',
        src: 'assets/death.wav'
    },{
        id: 'highscoreSound',
        src: 'assets/highscore.wav'
    }
  ]);
}
//Updates progress text with percentage.
function progress(e) {
    preloadText.text = Math.round(e.progress * 100) + '%';
    stage.update();
}
//function for the start screen
function start() {
    var startScreen = new createjs.Bitmap("assets/startpageSnakeGame.png");
    startScreen.x=0;
    startScreen.y=0;
    stage.addChild(startScreen);
    stage.update();
}
//function for setting up the game
function init() {
  //But first we clear out the stage
  window.removeEventListener("keypress",spacePressed);
  stage.removeAllChildren();
  score = 0;
  tail = [];
  //Creates the snake head element and gives it a standard speed
  snakeHead = new createjs.Shape();
  snakeHead.graphics.beginFill("#fff").drawRect(0,0, GRID_SIZE, GRID_SIZE);
  snakeHead.x = 0;
  snakeHead.y = 0;
  stage.addChild(snakeHead);
  snakeHead.xspeed = 1;
  snakeHead.yspeed = 0;
  //Calls the function for placing food on the canvas
  pickFoodLocation();
  //set the framerate
  createjs.Ticker.setFPS(10);
  createjs.Ticker.addEventListener("tick", tock);
}
//Make the tail Shape
function createTailPart() {
  //Creates a tail element
  var tailPart = new createjs.Shape();
  tailPart.graphics.beginFill("#fff").drawRect(0,0, GRID_SIZE, GRID_SIZE);
  tailPart.x = 0;
  tailPart.y = 0;
  return tailPart;
}
//Create food
function pickFoodLocation() {
  stage.removeChild(food);
  food = new createjs.Shape();
  food.graphics.beginFill("#FF0064").drawRect(0,0,GRID_SIZE,GRID_SIZE);
  stage.addChild(food);
  //Picks random location
  var cols = Math.floor(stage.canvas.width/GRID_SIZE);
  var rows = Math.floor(stage.canvas.height/GRID_SIZE);
  food.x = Math.floor(Math.random()*cols)*GRID_SIZE;
  food.y = Math.floor(Math.random()*rows)*GRID_SIZE;
}
//Create poison
function pickPoisonLocation() {
  stage.removeChild(poison);
  poison = new createjs.Shape();
  poison.graphics.beginFill("#0F0").drawRect(0,0,GRID_SIZE,GRID_SIZE);
  stage.addChild(poison);
  //Picks random location
  var cols = Math.floor(stage.canvas.width/GRID_SIZE);
  var rows = Math.floor(stage.canvas.height/GRID_SIZE);
  poison.x = Math.floor(Math.random()*cols)*GRID_SIZE;
  poison.y = Math.floor(Math.random()*rows)*GRID_SIZE;
}
//This is triggered when the snake hits the food element
function eatFood() {
  score++;
  createjs.Sound.play("eatSound");
  pickFoodLocation();
  //Calls the function for placing poison, if the score is > 5
  if(score>5){
    pickPoisonLocation();
  }
}
//function for the game over screen
function gameOver() {
  createjs.Sound.play("deathSound");
  stage.removeAllChildren();
  stage.removeChild(poison);
  window.addEventListener("keypress",spacePressed);
  isDead = true;
  //Shows your score
  var yourScore = new createjs.Text("Score: " + score*15, "45px pixelFont", "#fff");
  yourScore.x = 300;
  yourScore.y = 150;
  yourScore.textAlign = "center";
  stage.addChild(yourScore);
  //Adds instructions on final screen
  var playAgain = new createjs.Text("press space to play again","27px pixelFont", "#fff");
  playAgain.x = 70;
  playAgain.y = 500;
  stage.addChild(playAgain);
  //Checks if score is bigger than previous highscore
  if (score > highscore) {
     highscore = score;
     createjs.Sound.play("highscoreSound");
     //Displays highscore text
     var newHighscore = new createjs.Text("New high score!!","30px pixelFont", "#fff");
     newHighscore.x = 300;
     newHighscore.y = 350;
     newHighscore.textAlign = "center";
     stage.addChild(newHighscore);
     newHighscore.alpha=1;
     createjs.Tween.get(newHighscore, { loop: true }).to({alpha:0, visible:false}, 500);
     }
  //Shows your high score
  var yourHighScore = new createjs.Text("High score: " + highscore*15, "45px pixelFont", "#fff");
  yourHighScore.x = 300;
  yourHighScore.y = 230;
  yourHighScore.textAlign = "center";
  stage.addChild(yourHighScore);
  }
//controls functions
function keyPressed(evt) {
  //LEFT
  if(evt.keyCode === 37) {
    if(snakeHead.xspeed != 1){
    direction(-1,0);
  }
  }
  //UP
  else if (evt.keyCode === 38) {
    if(snakeHead.yspeed != 1){
    direction(0,-1);
  }
  }
  //RIGHT
  else if (evt.keyCode === 39) {
    if(snakeHead.xspeed != -1){
    direction(1,0);
  }
  }
  //DOWN
  else if (evt.keyCode === 40) {
    if(snakeHead.yspeed != -1){
    direction(0,1);
  }
  }
}
//This function changes the direction of the snakeHead based on key pressed
function direction(x,y) {
  snakeHead.xspeed = x;
  snakeHead.yspeed = y;
}
//Makes the snake re-appear on the other side of the canvas
function infiniteCanvas() {
  if(snakeHead.x>stage.canvas.width-GRID_SIZE){
    snakeHead.x = 0;
  } else if (snakeHead.x<0) {
    snakeHead.x = stage.canvas.width - GRID_SIZE;
  } else if (snakeHead.y>stage.canvas.height-GRID_SIZE) {
    snakeHead.y = 0;
  } else if (snakeHead.y<0) {
    snakeHead.y = stage.canvas.height - GRID_SIZE;
  }
}
//Function that calls init() when spacebar is pressed to start the game
function spacePressed(evt) {
  if (evt.keyCode===32) {
    isDead = false;
    init();
  }
}
//function containing elements that need to be updated at the framerate
function tock(e) {
  //Pushes new tail block to the tail array
  if (score > tail.length) {
    var newPart = createTailPart();
    tail.push(newPart);
    stage.addChild(newPart);
    console.log(tail.length);
  }
  //Cascading the location inside the tail array so it follows the movement of snakeHead
  for(var i=tail.length-1; i>=0; i--){
    if(i===0){
      tail[i].x=snakeHead.x;
      tail[i].y=snakeHead.y;
    } else {
      tail[i].x=tail[i-1].x;
      tail[i].y=tail[i-1].y;
    }
  }
  //Creates the movement to the snakeHead
  snakeHead.x+=snakeHead.xspeed * GRID_SIZE;
  snakeHead.y+=snakeHead.yspeed * GRID_SIZE;
  //calls the function that makes the snake re-appear on the opposite side of the canvas
  infiniteCanvas();
  //Hit detection between snakeHead and food
  var pt = snakeHead.localToLocal(10,10,food);
  if (food.hitTest(pt.x, pt.y)) {
    eatFood();
  }
  //Hit detection between snakeHead and poison
  if(score>5){
  if (isDead === false) {
  var p = snakeHead.localToLocal(10,10,poison);
  if (poison.hitTest(p.x, p.y)) {
    gameOver();
      }
    }
  }
  //Hit detection between snakeHead and tail (snake eats itself)
  for (var i = 0; i < tail.length; i++) {
    if (isDead === false) {
    var m = snakeHead.localToLocal(10,10,tail[i]);
    if (tail[i].hitTest(m.x, m.y)) {
    gameOver();
      }
    }
  }
  //Avoids food showing up on top of tail
  for (var i = 0; i < tail.length; i++) {
    var m = food.localToLocal(10,10,tail[i]);
    if (tail[i].hitTest(m.x, m.y)) {
    pickFoodLocation();
    }
  }
  //Avoids poison showing up on top of tail
  if(score>5){
    if(isDead===false){
    for (var i = 0; i < tail.length; i++) {
      var m = poison.localToLocal(10,10,tail[i]);
      if (tail[i].hitTest(m.x, m.y)) {
      pickPoisonLocation();
        }
      }
    }
  }
  //updates according to framerate
  stage.update(e);
}
//EventListeners
window.addEventListener("load", preload);
window.addEventListener("keypress",spacePressed);
window.addEventListener("keydown", keyPressed);
