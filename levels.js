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
    ladders.add( createLadder(temp[i],temp[i+1],temp[i+2], ladderImg) );
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
ground: [
0,0,1,1,
2,6,4,1,
-7,6,9,1,
-1,0,1,1,
1,-5,1,6,
1,-8,1,3,
2,-7,9,1,
-8,-7,1,14,
-8,-8,1,1,
-6,0,5,1,
1,-12,3,4,
2,-8,8,1,
4,-12,6,4,
9,-13,1,1,
10,-21,1,14,
11,-21,4,9,
-1,-21,10,2,
-7,-21,6,2,
-8,-21,1,13,
-7,-19,2,2,
-5,-19,1,1,
-7,-17,1,1,
-8,-30,1,9,
-7,-27,1,1,
-8,-38,1,8,
-5,-30,5,1,
-7,-26,1,2,
-7,-24,3,3,
4,-30,5,1,
13,-30,3,1,
16,-39,7,10,
16,-49,8,10,
10,6,2,1,
16,6,2,1,
18,6,7,1,
25,6,5,1,
22,-8,8,14,
],
ladders: [
0,-12,8,
-7,0,2,
9,-22,4,
15,-42,8,
],
doors: [
],
};