var editMode = "platform";

function editor(editorMode) {
  if (!editorMode)
    return
  
  if (editorMode == 'platform')
    editPlatform();
  if (editorMode == 'ladder')
    editLadder();
  if (editorMode == 'door')
    editDoor();
  
  //printing
  if (keyWentUp('p')){
    printMap();
  }
  
  //editor mode toggle
   if (keyWentUp('1'))
     editMode = 'platform';
  
   if (keyWentUp('2'))
     editMode = 'ladder';
  
  if (keyWentUp('3'))
     editMode = 'door';
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
      var temp = createDoor(worldMouseX(), worldMouseY(), dest, 0, -1);
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
  var temp = "levels[\'"+currentLevel+"\'] ={\n";
  
  temp += "ground: [\n";
  for(var i =0; i<ground.length;i++){
    var x = (ground[i].position.x-ground[i]._internalWidth/2)/block;
    var y = (ground[i].position.y-ground[i]._internalHeight/2)/block;
    var w = ground[i]._internalWidth/block;
    var h = ground[i]._internalHeight/block;
    temp += x +","+ y +","+ w +","+ h +",\n";
    
    levels[currentLevel].ground.push(x,y,w,h);
  }
  temp +="],\n";
  
  temp +="ladders: [\n";
  for(var i =0; i<ladders.length;i++){
    var x = (ladders[i].position.x-ladders[i]._internalWidth/2)/block;
    var y = (ladders[i].position.y-ladders[i]._internalHeight/2)/block;
    var h = ladders[i]._internalHeight/block;
    temp += x +","+ y +","+ h +",\n";
    
    levels[currentLevel].ladders.push(x,y,h);
  }
  temp +="],\n";
  
  temp +="doors: [\n";
  for(var i =0; i<doors.length;i++){
    var x = (doors[i].position.x-doors[i]._internalWidth/2)/block;
    var y = 1+ (doors[i].position.y-doors[i]._internalHeight/2)/block;
    var destination = doors[i].destination;
    var destX = doors[i].destinationX;
    var destY = doors[i].destinationY;
    temp += x +","+ y +", \'"+ destination +"\',"+ destX +","+ destY +",\n";
    
    levels[currentLevel].doors.push(x,y,destination,destX,destY);
  }
  temp +="],\n";
  temp +="};";
  
  console.log(temp);
}


// different types of object constructors

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
    if (levels[temp.destination] == undefined)
      levels[temp.destination] ={ground:[0,0,1,1,],ladders:[],doors:[],};
    
    loadLevel(temp.destination,temp.destinationX,temp.destinationY);
    currentLevel = temp.destination;
  };
  
  return temp
}