var block = 32;
var ground;
var spr;
var squareGroundImg;
var landed = false;
var level;


function preload() {
  level = loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Flevel.png?1512979496742');
  squareGroundImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fsquareground.png?1512964611722');
}

function setup() {
  var cnv = createCanvas(512,480);
  cnv.parent('sketch-holder');
  
  ground = new Group();
  for (var i =0; i<level.height; i++){
    for (var j =0; j<level.width; j++){
      if (level.get(j,i)[3] == 255 ){
        var temp  = createSprite(j*block +block/2, i*block +block/2, block, block);
        temp.draw = function() { image(squareGroundImg,0,0,block,block) }
        //temp.visible = false;
        ground.add(temp);
      }   
    }
  }
  
  spr = createSprite(32, 32, block, block*1.5);
  spr.shapeColor = color(255);
  spr.friction = 0.2;
  //spr.limitSpeed(10);
}

function draw() {
  noSmooth();
  background(0,0,0);
  
  spr.addSpeed(1.0, 90);
  
  if (spr.collide(ground) && spr.touching.bottom){
    spr.velocity.y = 0;
    landed = true;
  } 
  
  keyInput();
  moveCamera();
  drawSprites();
}

function keyInput() {
  if (keyDown(LEFT_ARROW)){
    spr.velocity.x += -.8;
  }
  if (keyDown(RIGHT_ARROW)){
    spr.velocity.x += .8;
  }
  if (keyDown(' ') && landed){
    spr.velocity.y = -32;
    landed = false;
  }
}

function moveCamera() {
  camera.position.x -= (camera.position.x - spr.position.x)*.08 ;
  camera.position.y -= (camera.position.y - spr.position.y)*.08 ;
}