var trex, trexrunning, trexcollided;
var ground, invisibleground, groundimage;
var cloud, cloudimage;
var o1, o2, o3, o4, o5, o6;
var score = 0;
var play = 1;
var end = 0;
var gamestate = play;
var obstacleGroup, cloudGroup;
var gameoverimg, restartimg, gameover, restart;
var jumpsound, diesound, checkpointsound;

function preload() {
  trexrunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexcollided = loadAnimation("trex_collided.png");
  groundimage = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");

  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
  o5 = loadImage("obstacle5.png");
  o6 = loadImage("obstacle6.png");
  
  gameoverimg=loadImage("gameOver.png");
  restartimg=loadImage("restart.png");
  
  jumpsound=loadSound("jump.mp3");
  diesound=loadSound("die.mp3");
  checkpointsound=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trexrunning);
  trex.addAnimation("collided", trexcollided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 200);
  ground.addImage("ground", groundimage);
  ground.x = ground.width / 2;

  invisibleground = createSprite(200, 190, 400, 10);
  invisibleground.visible = false;
  
  obstacleGroup=createGroup();
  cloudGroup=createGroup();
  
  gameover=createSprite(300,100);
  gameover.addImage(gameoverimg);
  gameover.scale=0.5;
  
  restart=createSprite(300, 140);
  restart.addImage(restartimg);
  restart.scale=0.5;
  
  trex.setCollider("circle",0,0,40);
  //trex.debug=true;
}

function draw() {
  background(180);

  fill("black");
  text("score: " + score, 500, 50);
 
  if (gamestate === play) {
    
    trex.changeAnimation("running", trexrunning)
    
    gameover.visible=false;
    restart.visible=false;
    
    ground.velocityX = -4;
    score = score + Math.round(frameCount / 60);
    
    if(score>0  &&  score%100 === 0){
      //checkpointsound.play();
    }

   if (ground.x < 0) {
   ground.x = ground.width/2;
    }
    if (keyDown("space") && trex.y >= 100) {
      trex.velocityY = -10;
      //jumpsound.play();
    }
    trex.velocityY = trex.velocityY + 0.8;

    spawnClouds();
    spawnObstacles();
    
    if(obstacleGroup.isTouching(trex)){
      gamestate=end;
    }

  } else if (gamestate === end) {
    
    gameover.visible=true;
    restart.visible=true;
    
    trex.velocityY=0;
    
    trex.changeAnimation("collided", trexcollided);
    
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    
    if(mousePressedOver(restart)){
      reset();
    }
    
  }
  trex.collide(invisibleground);
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40,10);
    cloud.addImage(cloudimage);
    cloud.y = Math.round(random(10, 60));
    cloud.scale = 0.4;
    cloud.lifetime = 300;
    cloud.velocityX = -3;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(400, 165, 10, 40);
    obstacle.velocityX = -4;

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(o1);
        break;
      case 2:
        obstacle.addImage(o2);
        break;
      case 3:
        obstacle.addImage(o3);
        break;
      case 4:
        obstacle.addImage(o4);
        break;
      case 5:
        obstacle.addImage(o5);
        break;
      case 6:
        obstacle.addImage(o6);
        break;
      default:
        break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstacleGroup.add(obstacle);
  }
}

function reset(){
  gamestate=play;
  
  gameover.visible=false;
  restart.visible=false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  score=0;
}