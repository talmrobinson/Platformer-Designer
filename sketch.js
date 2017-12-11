function setup() {
  var cnv = createCanvas(256,240);
  createSprite(width/2, height/2, 50, 50);
  cnv.parent('sketch-holder');
}

function draw() {
  background(0,0,0);  
  drawSprites();
}