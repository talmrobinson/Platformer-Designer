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
16,6,2,1,
18,6,7,1,
25,6,5,1,
22,-8,8,14,
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
16,6,2,1,
18,6,7,1,
25,6,5,1,
22,-8,8,14,
17,-27,6,3,
15,-24,8,3,
22,-29,1,2,
21,-29,1,2,
10,-6,1,3,
8,-6,2,4,
6,-6,2,3,
4,-6,2,2,
3,-6,1,1,
16,-1,3,1,
11,-4,3,1,
10,-3,1,1,
11,-3,1,1,
12,-3,1,1,
19,-7,3,1,
22,-16,8,8,
22,-21,7,5,
23,-26,6,5,
15,-17,6,1,
15,-21,1,1,
15,-20,1,3,
16,-21,1,1,
10,5,2,2,
11,-2,1,1,
10,-2,1,1,
2,-6,1,1,
-6,1,8,1,
2,-5,1,6,
2,1,1,1,
-7,-12,5,7,
19,-1,2,1,
17,-7,2,1,
8,-50,16,1,
8,-49,8,5,
7,-42,8,2,
0,-50,8,6,
0,-44,7,4,
23,-36,5,10,
],
ladders: [
0,-12,8,
-7,0,2,
9,-22,4,
15,-42,8,
0,-12,8,
-7,0,2,
9,-22,4,
15,-42,8,
21,-2,5,
21,-17,9,
],
doors: [
20,-28, '1.2',-3,-1,
],
};

levels['1.2'] ={
ground: [
0,0,1,1,
-8,6,15,1,
-8,-7,1,13,
1,-7,8,7,
1,0,1,1,
-7,-11,15,3,
-7,-8,15,1,
-8,-12,1,5,
-6,0,6,2,
0,1,1,1,
1,1,1,1,
8,-8,1,1,
9,-7,5,14,
7,6,2,1,
14,-7,2,14,
0,-7,1,1,
0,-1,1,1,
-7,-7,1,1,
5,5,1,1,
7,5,1,1,
6,4,1,1,
6,5,1,1,
],
ladders: [
-7,0,3,
],
doors: [
-3,-1, '1.0',20,-28,
],
};