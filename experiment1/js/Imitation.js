var w = 40;
var h = 40;

var grid = [];

var rand = 0.25;
function setup() {
  var myCanvas = createCanvas(800, 800);
  //myCanvas.parent("canvas-container");
  for(var i = 0; i < w; i++){
    grid.push([]);
  }
  for(var i = 0; i < grid.length; i++){
    for(var o = 0; o < h; o++){
      grid[i].push({x:(i + random(-rand, rand))*20 + 5, y:(o + random(-rand, rand))*20 + 5});
    }
  }
}
var totalvx = 0;
var totalvy = 0;
function draw() {
  background(0, 0, 0);
  stroke(255, 255, 255);
  fill(255, 255, 255);
  for(var i = 0; i < grid.length; i++){
    for(var o = 0; o < grid[i].length; o++){
      rect(grid[i][o].x, grid[i][o].y, 5, 5);
    }
  }
}