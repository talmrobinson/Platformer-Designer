window.addEventListener("contextmenu", function(e) { e.preventDefault(); });

var block = 64;
var ground;
var spr;
var squareGroundImg;
var landed = false;
var level;
var bgMusic;
var jumpSound;
var walkingAnimation;
var standingImage;
var drawX;
var drawY;


function preload() {
  level = loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Flevel.png?1512979496742');
  squareGroundImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fsquareground2.png?1513061116416');
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
  //imageToMap(level, ground);
  
  ground.add( createPlatform(0,14,16,4, squareGroundImg) );
  ground.add( createPlatform(20,14,4,1, squareGroundImg) );
  ground.add( createPlatform(0,9,1,6, squareGroundImg) );
  
  spr = createSprite(1*block, 1*block, block, block*2);
  spr.shapeColor = color(255);
  spr.friction = 0.1;
  spr.addAnimation( "walking", walkingAnimation);
  spr.addAnimation( "jumping", walkingAnimation.getImageAt(0));
  spr.addAnimation( "sliding", walkingAnimation.getImageAt(4));
  spr.addAnimation( "standing", standingImage);
  spr.width = block;
  spr.height = block*2;
  //spr.limitSpeed(10);
  //bgMusic.play();
}

function draw() {
  noSmooth();
  background(0,0,0);
  
  spr.addSpeed(1.2, 90);
  
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
  
}