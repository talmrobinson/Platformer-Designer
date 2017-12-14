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
var loadLevel = {};


function preload() {
  squareGroundImg= loadImage('https://cdn.glitch.com/10b9656a-6efd-4743-9e64-c92d136ef747%2Fgroundtexture.png?1513224979022');
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
  doors = new Group();
  hero = new Group();
  
  loadHero();
  loadLevel['1.0'](0,0);
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
  doors.draw();
  hero.draw();
  
  editor(editMode);
}

function keyInput() {
  if (keyWentUp(' '))
    canClimbJumpAgain = true;
  
  
  if (keyDown('a') && !climbing){
    spr.velocity.x += -.55;
    spr.mirrorX(-1);
    if (landed == true){
      spr.changeAnimation("walking");
      if(frameCount%12==0)
        stepSound.play();
    }
  }
  if (keyDown('d') && !climbing){
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
      spr.velocity.y *= 0.8;
      spr.position.y-=4 ;
      spr.changeAnimation("climbing");
      climbing = true;
      
      if(frameCount%12==0)
        stepSound.play();
    }
    
    //entering doors
    spr.overlap(doors, function(s,d){ d.teleport() });
  }
  if (keyDown('s')){
    //climbing
    if (spr.overlap(ladders, function(s,l){s.position.x = l.position.x}) ){
      spr.velocity.x = 0;
      spr.velocity.y *= 0.8;
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
  
  if (keyWentUp('3'))
     editMode = 'door';
  
  //level change
  if (keyWentUp(LEFT_ARROW)){
    loadLevel['1.0'](0,0);
  }else if (keyWentUp(RIGHT_ARROW)){
    loadLevel['1.1'](0,0);
  }
}

function moveCamera() {
  camera.position.x -= (camera.position.x - spr.position.x)*.2 ;
  camera.position.y -= (camera.position.y - spr.position.y)*.2 ;
}

function createPlatform(x,y,w,h,img) {
  var temp  = createSprite(x*block +w*block/2, y*block +h*block/2, w*block, h*block);
  
  temp.draw = function() {
    image(img,0,0,w*block,h*block,0,0,w*16,h*16);
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

function createDoor(x,y,destination, destX, destY) {
  var temp  = createSprite(x*block +block/2, (y-1)*block +2*block/2, block, 2*block);
  
  temp.draw = function() {
    fill(color(124));
    rect(0,0,block,2*block);
  };
  temp.destination = destination;
  temp.destinationX = destX;
  temp.destinationY = destY;
  temp.teleport = function() {
    loadLevel[temp.destination](temp.destinationX,temp.destinationY);
  };
  
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
  
  if (editorMode == 'door')
    editDoor();
  
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

function editDoor() {
  noFill();
  stroke('rgb(0,0,255)');
  rect(worldMouseX()*block, (worldMouseY()-1)*block, block, block*2);
  
  if (mouseWentUp(LEFT)){
    //destination prompt
    var dest = prompt("Door Destination:");
    if (dest != null) {
      var temp = createDoor(worldMouseX(), worldMouseY(), dest, 0, 0);
      temp.setCollider("rectangle", 0, 0, temp.width, temp.height );
      temp.addToGroup(doors);
    }
    
    console.log( "mouse position:" + worldMouseX() +', '+ worldMouseY() );
  }
  
  if (mouseWentUp(RIGHT)){
    console.log( "right click:" + worldMouseX() +', '+ worldMouseY() );
    var temp = createSprite(worldMouseX()*block +block/2, worldMouseY()*block +block/2, 1, 1);
    doors.overlap( temp, removeSprite);
    temp.remove();
  }
}

function printMap() {
  var temp = "";
  temp +="//platforms\n";
  temp +="ground.clear();\n";
  for(var i =0; i<ground.length;i++){
    var x = (ground[i].position.x-ground[i]._internalWidth/2)/block;
    var y = (ground[i].position.y-ground[i]._internalHeight/2)/block;
    var w = ground[i]._internalWidth/block;
    var h = ground[i]._internalHeight/block;
    temp += "ground.add( createPlatform("+ x +","+ y +","+ w +","+ h +", squareGroundImg) );\n";
  }
  
  temp +="//ladders\n";
  temp +="ladders.clear();\n";
  for(var i =0; i<ladders.length;i++){
    var x = (ladders[i].position.x-ladders[i]._internalWidth/2)/block;
    var y = (ladders[i].position.y-ladders[i]._internalHeight/2)/block;
    var h = ladders[i]._internalHeight/block;
    temp += "ladders.add( createLadder("+ x +","+ y +","+ h +", ladderImg) );\n";
  }
  
  temp +="//doors\n";
  temp +="doors.clear();\n";
  for(var i =0; i<doors.length;i++){
    var x = (doors[i].position.x-doors[i]._internalWidth/2)/block;
    var y = 1+ (doors[i].position.y-doors[i]._internalHeight/2)/block;
    var destination = doors[i].destination;
    var destX = doors[i].destinationX;
    var destY = doors[i].destinationY;
    temp += "doors.add( createDoor("+ x +","+ y +", \'"+ destination +"\',"+ destX +","+ destY +") );\n";
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

loadLevel['1.0'] = function(x,y) {
  //platforms
  ground.clear();
  ground.add( createPlatform(0,2,1,1, squareGroundImg) );
  ground.add( createPlatform(1,-4,1,7, squareGroundImg) );
  ground.add( createPlatform(-1,-4,1,7, squareGroundImg) );
  ground.add( createPlatform(-4,3,9,1, squareGroundImg) );
  ground.add( createPlatform(0,4,1,1, squareGroundImg) );
  //ladders
  ladders.clear();
  ladders.add( createLadder(0,-8,6, ladderImg) );
  //doors
  doors.clear();
  doors.add( createDoor(-4, 2,'1.1',0,0));
  
  //hero
  spr.position.x = (x+0.5)*block;
  spr.position.y = (y-0.5)*block;
}

loadLevel['1.1'] = function(x,y) {
  //platforms
  ground.clear();
  ground.add( createPlatform(8,-5,1,9, squareGroundImg) );
  ground.add( createPlatform(-8,-5,1,9, squareGroundImg) );
  ground.add( createPlatform(8,-15,1,10, squareGroundImg) );
  ground.add( createPlatform(-8,-17,1,12, squareGroundImg) );
  ground.add( createPlatform(-7,-8,7,1, squareGroundImg) );
  ground.add( createPlatform(-6,-18,5,6, squareGroundImg) );
  ground.add( createPlatform(-8,-27,1,10, squareGroundImg) );
  ground.add( createPlatform(8,-30,1,15, squareGroundImg) );
  ground.add( createPlatform(8,-39,1,9, squareGroundImg) );
  ground.add( createPlatform(8,-41,1,2, squareGroundImg) );
  ground.add( createPlatform(-8,-41,1,14, squareGroundImg) );
  ground.add( createPlatform(-8,4,17,1, squareGroundImg) );
  ground.add( createPlatform(-1,-18,2,1, squareGroundImg) );
  ground.add( createPlatform(6,-18,2,1, squareGroundImg) );
  ground.add( createPlatform(6,-34,1,2, squareGroundImg) );
  ground.add( createPlatform(5,-33,1,2, squareGroundImg) );
  ground.add( createPlatform(4,-32,1,2, squareGroundImg) );
  ground.add( createPlatform(3,-31,1,1, squareGroundImg) );
  ground.add( createPlatform(-7,-30,11,3, squareGroundImg) );
  ground.add( createPlatform(-1,-17,1,1, squareGroundImg) );
  ground.add( createPlatform(7,3,1,1, squareGroundImg) );
  ground.add( createPlatform(-7,3,1,1, squareGroundImg) );
  ground.add( createPlatform(7,2,1,1, squareGroundImg) );
  ground.add( createPlatform(-7,2,1,1, squareGroundImg) );
  ground.add( createPlatform(6,3,1,1, squareGroundImg) );
  ground.add( createPlatform(-6,3,1,1, squareGroundImg) );
  //ladders
  ladders.clear();
  ladders.add( createLadder(0,-8,8, ladderImg) );
  ladders.add( createLadder(0,-9,1, ladderImg) );
  ladders.add( createLadder(-7,-18,6, ladderImg) );
  ladders.add( createLadder(7,-27,5, ladderImg) );
  ladders.add( createLadder(7,-35,8, ladderImg) );
  //doors
  doors.clear();
  doors.add( createDoor(-6, -31,'1.0',0,0));
  
  
  //hero
  spr.position.x = (x+0.5)*block;
  spr.position.y = (y-0.5)*block;
}