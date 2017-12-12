var block = 32;
var ground;
var spr;
var squareGroundImg;
var landed = false;
var level;
var bgMusic;
var jumpSound;
var walkingAnimation;
var standingImage;


function preload() {
  level = loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Flevel.png?1512979496742');
  squareGroundImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fsquareground.png?1512964611722');
  standingImage = loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fstand.png?1513057083012');
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
  var cnv = createCanvas(512,480);
  cnv.parent('sketch-holder');
  
  ground = new Group();
  //imageToMap(level, ground);
  
  ground.add( createPlatform(0,15,16,1, squareGroundImg) );
  ground.add( createPlatform(0,0,1,15, squareGroundImg) );
  
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
  
  if ( Math.floor(spr.velocity.x) <2 && Math.abs(spr.velocity.y) < 1.5 && landed == true){
    spr.changeAnimation("standing");
  }else{
    spr.changeAnimation("sliding");
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
    spr.mirrorX(-1);
    spr.changeAnimation("walking");
  }
  if (keyDown(RIGHT_ARROW)){
    spr.velocity.x += .5;
    spr.mirrorX(1);
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
  camera.position.y -= (camera.position.y - spr.position.y+block*3)*.08 ;
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