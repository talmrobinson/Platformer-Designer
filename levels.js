function loadLevel(name,x,y){
  //platforms
  ground.clear();
  var temp = levels[name].ground;
  for (var i=0; i<temp.length;i+=4){
    ground.add( createPlatform(temp[i],temp[i+1],temp[i+2],temp[i+3], squareGroundImg) );
  }

  //ladders
  ladders.clear();
  var temp = levels[name].ladders;
  for (var i=0; i<temp.length;i+=3){
    ladders.add( createLadder(temp[i].x,temp[i+1].y,temp[i+2].h, ladderImg) );
  }
  //doors
  doors.clear();
  var temp = levels[name].doors;
  for (var i=0; i<temp.length;i+=5){
    doors.add( createDoor(temp[i],temp[i+1],temp[i+2],temp[i+3],temp[i+4]) );
  }
  
  //hero
  spr.position.x = (x+0.5)*block;
  spr.position.y = (y-0.5)*block;
}

var levels = {};

levels['1.0'] ={
  ground: [0,0,1,1,],
  ladders: [],
  doors: [],
};