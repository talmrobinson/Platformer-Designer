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
  //imageToMap(level, ground);
  
  ground.add( createPlatform(2,6,5,5, squareGroundImg) );
  ground.add( createPlatform(2,6,5,5, squareGroundImg) );
  
  spr = createSprite(32, 32, block, block);
  spr.shapeColor = color(255);
  spr.friction = 0.1;
  //spr.limitSpeed(10);
}

function draw() {
  noSmooth();
  background(0,0,0);
  
  spr.addSpeed(1.2, 90);
  
  if (spr.collide(ground) && spr.touching.bottom){
    spr.velocity.y = 0;
    landed = true;
  } 
  
  keyInput();
  moveCamera();
  drawSprites();
  
  if (frameCount%240==0)
    console.log(spr.position.x/block + ', ' + spr.position.y/block);
}

function keyInput() {
  if (keyDown(LEFT_ARROW)){
    spr.velocity.x += -.5;
  }
  if (keyDown(RIGHT_ARROW)){
    spr.velocity.x += .5;
  }
  if (keyDown(' ')){
    if (landed){
      spr.velocity.y = -16;
    }
    else if (spr.velocity.y < 0){
      spr.velocity.y -=1;
    }
    
    landed = false;
  }
}

function moveCamera() {
  camera.position.x -= (camera.position.x - spr.position.x)*.08 ;
  camera.position.y -= (camera.position.y - spr.position.y)*.08 ;
}

function imageToMap(myImg,myMap){
  for (var i =0; i<myImg.height; i++){
    for (var j =0; j<myImg.width; j++){
      if (myImg.get(j,i)[3] == 255 ){
        var temp  = createSprite(j*block +block/2, i*block +block/2, block, block);
        temp.draw = function() { image(squareGroundImg,0,0,block,block) }
        //temp.visible = false;
        myMap.add(temp);
      }   
    }
  }
}


function createPlatform(x,y,w,h,img) {
  var temp  = createSprite(x*block, y*block, w*block, h*block);
  temp.draw = function() {
    for (var i =0; i<h; i++){
      for (var j =0; j<w; j++){  
        image(img,j*block -w*block/2 +block/2,i*block -h*block/2 +block/2,block,block);
      }
    }
  }
  return temp
}