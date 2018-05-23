window.addEventListener("contextmenu", function(e) { e.preventDefault(); });

var block = 32;
var ground;
var ladders;
var doors;
var spr;
var hero;
var squareGroundImg;
var ladderImg;
var landed = false;
var climbing = false;
var canClimbJump = true;
var bgMusic;
var jumpSound;
var stepSound;
var walkingAnimation;
var climbingAnimation;
var standingImage;
var drawX;
var drawY;
var currentLevel = '1';


function preload() {
  squareGroundImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fgroundtexture2.png?1513390142102');
  ladderImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fladder.png?1513120412634');
  standingImage = loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fstand.png?1513060104302');
  walkingAnimation = loadAnimation("https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk1.png?1513055412898",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk2.png?1513055413022",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk3.png?1513055412888",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk4.png?1513055412820",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk5.png?1513055413007",
                                   "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fwalk6.png?1513055412874");
  climbingAnimation = loadAnimation("https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fclimb1.png?1513137010206",
                                    "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fclimb2.png?1513137010290",
                                    "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fclimb1.png?1513137010206",
                                    "https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fclimb2.png?1513137010290");
  bgMusic = loadSound('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fmusic1.mp3?1513044930321');
  jumpSound = loadSound('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fjump.mp3?1513045615069');
  jumpSound.setVolume(0.5);
  stepSound = loadSound('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fstep.mp3?1513133237482');
  stepSound.setVolume(0.1);
}

function setup() {
  var cnv = createCanvas(544,512);
  cnv.parent('sketch-holder');
  
  ground = new Group();
  ladders = new Group();
  doors = new Group();
  hero = new Group();
  
  
  loadLevel('1',10.5,4);
  //spr.scale = 2;
  //spr.limitSpeed(10);
  //bgMusic.play();
  //camera.zoom = 2;
  
  camera.position.x = spr.position.x;
  camera.position.y = spr.position.y;
}

function draw() {
  noSmooth();
  background(0,0,0);
  
  if (!climbing)
    spr.addSpeed(1.2, 90);
  else if (!spr.overlap(ladders)){
    if (spr.velocity.y < 1){
    spr.position.y+=4;
    spr.velocity.y=0;
    }else{
      spr.addSpeed(1.2, 90);
      climbing = false;
    }   
  }
    
    
  
  if ( spr.collide(ground) && spr.touching.bottom){
    if (!landed){
      stepSound.play();
      camera.position.y-=5; //camera shake thump effect
    }
    if (climbing)
      climbing = false;
    
    spr.velocity.y = 0;
    landed = true;
  }
  
  if ( Math.floor(Math.abs(spr.velocity.x)) <1 && landed == true){
    spr.changeAnimation("standing");
  }else{
    spr.changeAnimation("sliding");
  }
  
  keyInput();
  moveCamera();
  ground.draw();
  ladders.draw();
  doors.draw();
  hero.draw();

  editor(editMode);
  
  //outside boundaries for peeking beyond camera
  camera.off();
  noStroke();
  fill( color(255,255,255,191));
  rect(0,0,width,block);
  rect(0,height-block,width,block);
  rect(0,block,block,height-block*2);
  rect(width-block,block,block,height-block*2);
}

function keyInput() {
  if (keyWentUp(' '))
    canClimbJump = true;
  
  if (keyWentUp('w')){
    //entering doors
    spr.overlap(doors, function(s,d){ d.teleport() });
  }
  
  
  if (keyDown('a') && !climbing){
    // running
    spr.velocity.x += -.55;
    spr.mirrorX(-1);
    if (landed == true){
      spr.changeAnimation("walking");
      if(frameCount%12==0)
        stepSound.play();
    }
  }
  if (keyDown('d') && !climbing){
    // running
    spr.velocity.x += .55;
    spr.mirrorX(1);
    if (landed == true){
      spr.changeAnimation("walking");
      if(frameCount%12==0)
        stepSound.play();
    }
  }
  if (keyDown('w')){
    //climbing
    if (spr.overlap(ladders, function(s,l){s.position.x = l.position.x }) ){
      spr.velocity.x = 0; 
      //spr.velocity.y *= 0.8;
      spr.position.y-=4 ;
      spr.changeAnimation("climbing");
      climbing = true;
      landed = false;
      
      if(frameCount%12==0)
        stepSound.play();
    }
  }
  if (keyDown('s')){
    //climbing
    if (spr.overlap(ladders, function(s,l){s.position.x = l.position.x}) ){
      spr.velocity.x = 0;
      //spr.velocity.y *= 0.8;
      spr.position.y+=4 ;
      spr.changeAnimation("climbing");
      climbing = true;
      landed = false;
      
      if(frameCount%12==0)
        stepSound.play();
    }
  }
  if (keyDown(' ')){
    // jumping
    if (landed || (climbing && canClimbJump) ) {
      spr.velocity.y = -16;
      jumpSound.play();
      canClimbJump = false;
    }
    else if (spr.velocity.y < 0){
      spr.velocity.y -=1;
    }
    spr.changeImage("jumping");
    landed = false;
    climbing = false;
  }
  
}

function moveCamera() {
  camera.position.x -= (camera.position.x - spr.position.x)*.2 ;
  camera.position.y -= (camera.position.y - spr.position.y)*.2 ;
  
  if (camera.position.y > 0)
    camera.position.y = 0;
  
  if (camera.position.x < -16)
    camera.position.x = -16;
}

function worldMouseX() {
  return Math.floor((mouseX-width/2 +camera.position.x)/block);
}

function worldMouseY() {
  return Math.floor((mouseY-height/2 +camera.position.y)/block);
}

function loadHero() {
  spr = createSprite(0.5*block, 0, block, block*2);
  spr.friction = 0.1;
  spr.addAnimation( "walking", walkingAnimation);
  spr.addAnimation( "jumping", walkingAnimation.getImageAt(0));
  spr.addAnimation( "sliding", walkingAnimation.getImageAt(4));
  spr.addAnimation( "standing", standingImage);
  spr.addAnimation( "climbing", climbingAnimation);
  spr.width = block;
  spr.height = block*2;
  hero.add(spr);
}