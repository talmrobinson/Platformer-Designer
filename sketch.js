window.addEventListener("contextmenu", function(e) { e.preventDefault(); });

var block = 32;
var ground;
var ladders;
var spr;
var squareGroundImg;
var ladderImg;
var landed = false;
var climbing = false;
var bgMusic;
var jumpSound;
var walkingAnimation;
var standingImage;
var drawX;
var drawY;


function preload() {
  squareGroundImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fsquareground2.png?1513061116416');
  ladderImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fladder.png?1513120412634');
  standingImage = loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fstand.png?1513060104302');
  walkingAnimation = loadAnimation("https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk1.png?1513055412898",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk2.png?1513055413022",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk3.png?1513055412888",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk4.png?1513055412820",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk5.png?1513055413007",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk6.png?1513055412874");
  bgMusic = loadSound('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fmusic1.mp3?1513044930321');
  jumpSound = loadSound('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fjump.mp3?1513045615069');
}

function setup() {
  var cnv = createCanvas(768,576);
  cnv.parent('sketch-holder');
  
  ground = new Group();
  ground.add( createPlatform(0,1,1,1, squareGroundImg) );
  
  ladders = new Group();
  ladders.add(createLadder(6,6,1, ladderImg));
  
  spr = createSprite(0.5*block, 0, block, block*2);
  spr.shapeColor = color(255);
  spr.friction = 0.1;
  spr.addAnimation( "walking", walkingAnimation);
  spr.addAnimation( "jumping", walkingAnimation.getImageAt(0));
  spr.addAnimation( "sliding", walkingAnimation.getImageAt(4));
  spr.addAnimation( "standing", standingImage);
  spr.width = block;
  spr.height = block*2;
  //spr.scale = 2;
  //spr.limitSpeed(10);
  //bgMusic.play();
}

function draw() {
  noSmooth();
  background(0,0,0);
  
  if (!climbing)
    spr.addSpeed(1.2, 90);
  else if (!spr.overlap(ladders)){
    climbing = false;
    spr.addSpeed(1.2, 90);
  }
    
    
  
  if (spr.collide(ground) && spr.touching.bottom){
    spr.velocity.y = 0;
    if (!landed) //camera shake thump effect
      camera.position.y-=5; //camera shake thump effect
    landed = true;
  }
  
  if ( Math.floor(Math.abs(spr.velocity.x)) <1 && landed == true){
    spr.changeAnimation("standing");
  }else{
    spr.changeAnimation("sliding");
  }
  
  keyInput();
  moveCamera();
  drawSprites();
  
  editor(true);
}

function keyInput() {
  if (keyDown('a')){
    spr.velocity.x += -.5;
    spr.mirrorX(-1);
    if (landed == true)
      spr.changeAnimation("walking");
  }
  if (keyDown('d')){
    spr.velocity.x += .5;
    spr.mirrorX(1);
    if (landed == true)
      spr.changeAnimation("walking");
  }
  if (keyDown('w')){
    if (spr.overlap(ladders, function(s,l){s.position.x = l.position.x }) ){
      spr.position.y-=2 ;
      spr.changeAnimation("standing");
      climbing = true;
    }
  }
  if (keyDown(' ')){
    if (landed){
      spr.velocity.y = -16;
      jumpSound.play();
    }
    else if (spr.velocity.y < 0){
      spr.velocity.y -=1;
    }
    spr.changeImage("jumping");
    landed = false;
  }
}

function moveCamera() {
  camera.position.x -= (camera.position.x - spr.position.x)*.08 ;
  camera.position.y -= (camera.position.y - spr.position.y)*.08 ;
}

function createPlatform(x,y,w,h,img) {
  var temp  = createSprite(x*block +w*block/2, y*block +h*block/2, w*block, h*block);
  temp.draw = function() {
    for (var i =0; i<h; i++){
      for (var j =0; j<w; j++){  
        image(img,j*block -w*block/2 +block/2,i*block -h*block/2 +block/2,block,block);
      }
    }
  }
  return temp
}

function createLadder(x,y,h,img) {
  var temp  = createSprite(x*block +block/2, y*block +h*block/2, block, h*block);
  temp.draw = function() {
    for (var i =0; i<h; i++){
      image(img, 0,i*block -h*block/2 +block/2,block,block);
    }
  }
  return temp
}

function worldMouseX() {
  return Math.floor((mouseX-width/2 +camera.position.x)/block);
}

function worldMouseY() {
  return Math.floor((mouseY-height/2+camera.position.y)/block);
}

function editor(editorMode) {
  if (!editorMode)
    return
  
  noFill();
  stroke('rgb(0,255,0)');
  
  if (mouseWentDown(LEFT)){
    console.log( "mouse position:" + worldMouseX() +', '+ worldMouseY() );
    drawX = worldMouseX();
    drawY = worldMouseY();
  }
  
  if (mouseDown(LEFT)){
    var x = Math.min(worldMouseX(),drawX);
    var y = Math.min(worldMouseY(),drawY);
    var w = 1+ Math.abs(worldMouseX()-drawX);
    var h = 1+ Math.abs(worldMouseY()-drawY);
    rect(x*block, y*block, w*block, h*block);
  }
  else
    rect(worldMouseX()*block, worldMouseY()*block, block, block);
  
  if (mouseWentUp(LEFT)){
    var x = Math.min(worldMouseX(),drawX);
    var y = Math.min(worldMouseY(),drawY);
    var w = 1+ Math.abs(worldMouseX()-drawX);
    var h = 1+ Math.abs(worldMouseY()-drawY);
    var temp = createPlatform(x, y, w, h, squareGroundImg);
    temp.setCollider("rectangle", 0, 0, temp.width, temp.height );

    temp.addToGroup(ground);
  }
  
  if (mouseWentUp(RIGHT)){
    console.log( "right click:" + worldMouseX() +', '+ worldMouseY() );
    var temp = createSprite(worldMouseX()*block +block/2, worldMouseY()*block +block/2, 1, 1);
    ground.overlap( temp, removeSprite);
    temp.remove();
  }
  
  if (keyWentUp('p')){
    printMap();
  }
}


function printMap() {
  var temp = "";
  for(var i =0; i<ground.length;i++){
    var x = ground[i].position.x/block;
    var y = ground[i].position.y/block;
    var w = ground[i]._internalHeight/block;
    var h = ground[i]._internalWidth/block;
    temp += "ground.add( createPlatform("+ (x-0.5) +","+ (y-0.5) +","+ w +","+ h +", squareGroundImg) );\n";
  }
  console.log(temp);
}