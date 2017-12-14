window.addEventListener("contextmenu", function(e) { e.preventDefault(); });

var block = 32;
var ground;
var ladders;
var spr;
var hero;
var squareGroundImg;
var ladderImg;
var landed = false;
var climbing = false;
var bgMusic;
var jumpSound;
var stepSound;
var walkingAnimation;
var climbingAnimation;
var standingImage;
var drawX;
var drawY;
var canClimbJumpAgain = true;
var editMode = "platform";
var loadLevel = [];


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
  var cnv = createCanvas(512,480);
  cnv.parent('sketch-holder');
  
  ground = new Group();
  ladders = new Group();
  hero = new Group();
  
  loadHero();
  loadLevel['1.0']();
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
  hero.draw();
  
  editor(editMode);
}

function keyInput() {
  if (keyWentUp(' '))
    canClimbJumpAgain = true;
  
  if (keyDown('a') && !climbing){
    spr.velocity.x += -.5;
    spr.mirrorX(-1);
    if (landed == true){
      spr.changeAnimation("walking");
      if(frameCount%12==0)
        stepSound.play();
    }
  }
  if (keyDown('d') && !climbing){
    spr.velocity.x += .5;
    spr.mirrorX(1);
    if (landed == true){
      spr.changeAnimation("walking");
      if(frameCount%12==0)
        stepSound.play();
    }
  }
  if (keyDown('w')){
    if (spr.overlap(ladders, function(s,l){s.position.x -= (s.position.x-l.position.x)*.5 }) ){
      spr.position.y-=4 ;
      spr.changeAnimation("climbing");
      climbing = true;
      
      if(frameCount%12==0)
        stepSound.play();
    }
  }
  if (keyDown('s')){
    if (spr.overlap(ladders, function(s,l){s.position.x -= (s.position.x-l.position.x)*.5 }) ){
      spr.position.y+=4 ;
      spr.changeAnimation("climbing");
      climbing = true;
      
      if(frameCount%12==0)
        stepSound.play();
    }
  }
  if (keyDown(' ')){
    if (landed || (climbing && canClimbJumpAgain)) {
      spr.velocity.y = -16;
      jumpSound.play();
      climbing = false;
      canClimbJumpAgain = false;
    }
    else if (spr.velocity.y < 0 && !climbing){
      spr.velocity.y -=1;
    }
    spr.changeImage("jumping");
    landed = false;
  }
  
  //editor mode toggle
   if (keyWentUp('1'))
     editMode = 'platform';
  
   if (keyWentUp('2'))
     editMode = 'ladder';
}

function moveCamera() {
  camera.position.x -= (camera.position.x - spr.position.x)*.5 ;
  camera.position.y -= (camera.position.y - spr.position.y)*.5 ;
}

function createPlatform(x,y,w,h,img) {
  var temp  = createSprite(x*block +w*block/2, y*block +h*block/2, w*block, h*block);
  
  if ( w < 3 || h < 3){
    temp.draw = function() {
      for (var i =0; i<h; i++){
        for (var j =0; j<w; j++){  
          image(img,j*block -w*block/2 +block/2,i*block -h*block/2 +block/2,block,block);
        }
      }
    }
  }else{
    temp.draw = function() {
        noStroke();
        fill( color(124));
        rect(0,0, block*w, block*h);
        //image(img, 0, 0, block*w,block*h);
        
        for (var i =0; i<h; i++){
          image(img,0 -w*block/2 +block/2,i*block -h*block/2 +block/2,block,block);
          image(img,(w-1)*block -w*block/2 +block/2,i*block -h*block/2 +block/2,block,block);
        }
        for (var j =0; j<w; j++){
          image(img,j*block -w*block/2 +block/2,0 -h*block/2 +block/2,block,block);
          image(img,j*block -w*block/2 +block/2,(h-1)*block -h*block/2 +block/2,block,block);
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
  
  if (editorMode == 'platform')
    editPlatform();
  
  if (editorMode == 'ladder')
    editLadder();
  
  if (keyWentUp('p')){
    printMap();
  }
}

function editPlatform() {
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

function editLadder() {
  noFill();
  stroke('rgb(255,0,0)');
  
  if (mouseWentDown(LEFT)){
    console.log( "mouse position:" + worldMouseX() +', '+ worldMouseY() );
    drawX = worldMouseX();
    drawY = worldMouseY();
  }
  
  if (mouseDown(LEFT)){
    var x = drawX;
    var y = Math.min(worldMouseY(),drawY);
    var h = 1+ Math.abs(worldMouseY()-drawY);
    
    rect(x*block, y*block, block, h*block);
  }
  else
    rect(worldMouseX()*block, worldMouseY()*block, block, block);
  
  if (mouseWentUp(LEFT)){
    var x = drawX;
    var y = Math.min(worldMouseY(),drawY);
    var h = 1+ Math.abs(worldMouseY()-drawY);
    var temp = createLadder(x, y, h, ladderImg);
    temp.setCollider("rectangle", 0, 0, temp.width, temp.height );

    temp.addToGroup(ladders);
  }
  
  if (mouseWentUp(RIGHT)){
    console.log( "right click:" + worldMouseX() +', '+ worldMouseY() );
    var temp = createSprite(worldMouseX()*block +block/2, worldMouseY()*block +block/2, 1, 1);
    ladders.overlap( temp, removeSprite);
    temp.remove();
  }
}


function printMap() {
  var temp = "";
  temp +="//platforms\n";
  for(var i =0; i<ground.length;i++){
    var x = (ground[i].position.x-ground[i]._internalWidth/2)/block;
    var y = (ground[i].position.y-ground[i]._internalHeight/2)/block;
    var w = ground[i]._internalWidth/block;
    var h = ground[i]._internalHeight/block;
    temp += "ground.add( createPlatform("+ x +","+ y +","+ w +","+ h +", squareGroundImg) );\n";
  }
  
  temp +="//ladders\n";
  for(var i =0; i<ladders.length;i++){
    var x = (ladders[i].position.x-ladders[i]._internalWidth/2)/block;
    var y = (ladders[i].position.y-ladders[i]._internalHeight/2)/block;
    var h = ladders[i]._internalHeight/block;
    temp += "ladders.add( createLadder("+ x +","+ y +","+ h +", ladderImg) );\n";
  }
  console.log(temp);
}

function loadHero() {
  spr = createSprite(0.5*block, 0, block, block*2);
  spr.shapeColor = color(255);
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

loadLevel['1.0'] = function() {
  ground.clear();
  //platforms
  ground.add( createPlatform(0,2,1,1, squareGroundImg) );
  ground.add( createPlatform(1,-4,1,7, squareGroundImg) );
  ground.add( createPlatform(-1,-4,1,7, squareGroundImg) );
  ground.add( createPlatform(-4,3,9,1, squareGroundImg) );
  ground.add( createPlatform(0,4,1,1, squareGroundImg) );
  //ladders
  ladders.clear();
  ladders.add( createLadder(0,-8,6, ladderImg) );
  
  //hero
  spr.position.x = 0.5*block;
  spr.position.y = 0*block;
}

loadLevel['1.1'] = function() {
  ground.clear();
  //platforms
  ground.add( createPlatform(0,2,1,1, squareGroundImg) );
  ground.add( createPlatform(1,-4,1,7, squareGroundImg) );
  ground.add( createPlatform(-1,-4,1,7, squareGroundImg) );
  ground.add( createPlatform(-4,3,9,1, squareGroundImg) );
  ground.add( createPlatform(0,4,1,1, squareGroundImg) );
  //ladders
  ladders.clear();
  ladders.add( createLadder(0,-8,6, ladderImg) );
  
  //hero
  spr.position.x = 0.5*block;
  spr.position.y = 0*block;
}