var block = 32;
var ground;
var spr;
var squareGroundImg;
var landed = false;
var level = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
             1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
             1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
             1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,
             1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,
             1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,
             1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,
             1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
             1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
             1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
             1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,
             1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,
             1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,
             1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,
             1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];


function preload() {
  squareGroundImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fsquareground.png?1512964611722');
}

function setup() {
  var cnv = createCanvas(512,480);
  cnv.parent('sketch-holder');
  
  ground = new Group();
  for (var i =0; i<15; i++){
    for (var j =0; j<16; j++){
      if (level[i*16+j]){
        var temp  = createSprite(j*block +block/2, i*block +block/2, block, block);
        temp.draw = function() { image(squareGroundImg,0,0,block,block) }
        ground.add(temp);
      }   
    }
  }
  
  spr = createSprite(width/2, height/2, block, block*1.5);
  spr.shapeColor = color(255);
  spr.friction = 0.1;
  //spr.limitSpeed(10);
}

function draw() {
  noSmooth();
  background(0,0,0);
  
  spr.addSpeed(1.5, 90);
  
  if (spr.collide(ground) && spr.touching.bottom){
    spr.velocity.y = 0;
    landed = true;
  } 
  
  
  if (keyDown(LEFT_ARROW)){
    spr.velocity.x += -.8;
  }
  if (keyDown(RIGHT_ARROW)){
    spr.velocity.x += .8;
  }
    
  
  drawSprites();
}

function keyPressed() {
  if (key == ' ' && landed) {
      spr.velocity.y = -32;
      landed = false;
  }
  return false;
}