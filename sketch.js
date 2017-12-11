var block = 32;
var ground;
var spr;
var squareGroundImg;
var level = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];


function preload() {
  squareGroundImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fsquareground.png?1512964611722');
}

function setup() {
  noSmooth();
  var cnv = createCanvas(512,480);
  cnv.parent('sketch-holder');
  
  ground = new Group();
  for (var i =0; i<15; i++){
    for (var j =0; j<16; j++){
      if (level[i*16+j]){
        var temp  = createSprite(j*block +block/2, i*block +block/2, block, block);
        squareGroundImg.resize(block, 0);
        temp.addImage(squareGroundImg);
        ground.add(temp);
      }   
    }
  }
  
  spr = createSprite(width/2, height/2, block, block);
  spr.shapeColor = color(255);
  spr.velocity.y = 0.5;
}

function draw() {
  background(0,0,0);  
  drawSprites();
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    spr.setSpeed(1.5, 0);
  }
  else if (keyCode == DOWN_ARROW) {
    spr.setSpeed(1.5, 90);
  }
  else if (keyCode == LEFT_ARROW) {
    spr.setSpeed(1.5, 180);
  }
  else if (keyCode == UP_ARROW) {
    spr.setSpeed(1.5, 270);
  }
  else if (key == ' ') {
    spr.setSpeed(0, 0);
  }
  return false;
}