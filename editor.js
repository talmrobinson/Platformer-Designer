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
  var temp = "level[\'"+currentLevel+"\'] ={\n";
  
  temp +="//platforms\n";
  temp +="ground.clear();\n";
  for(var i =0; i<ground.length;i++){
    t.x = (ground[i].position.x-ground[i]._internalWidth/2)/block;
    t.y = (ground[i].position.y-ground[i]._internalHeight/2)/block;
    t.w = ground[i]._internalWidth/block;
    t.h = ground[i]._internalHeight/block;
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