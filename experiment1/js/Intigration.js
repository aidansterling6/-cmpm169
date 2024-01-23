var w = 41;
var h = 40;

var grid = [];

var rand = 0.25;
function setup() {
  createCanvas(800, 800);
  for(var i = 0; i < w; i++){
    grid.push([]);
  }
  for(var i = 0; i < grid.length; i++){
    for(var o = 0; o < h; o++){
      
      grid[i].push({x:(i + random(-rand, rand))*20 + 5, y:(o + random(-rand, rand))*20 + 5, Links:[], color:{r:random(0,255), r:random(0,255), r:random(0,255)}});
    }
  }
  for(var i = 0; i < grid.length; i++){
    for(var o = 0; o < grid[i].length; o++){
      for(var x = -1; x <= 1; x++){
        for(var y = -1; y <= 1; y++){
          if(x !== 0 && y !== 0 && i + x >= 0 && i + x < grid.length && o + y >= 0 && o + y < grid[i].length){
            grid[i][o].Links.push({i:i + x, o:o + y, InitDist:dist(grid[i][o].x, grid[i][o].y, grid[i+x][o+y].x,grid[i+x][o+y].y)});
          }
        }
      }
    }
  }
}
var t = 0;
function draw() {
  background(220, 220, 220, 20);
  stroke(0, 0, 0);
  fill(0,0,0);
  for(var i = 0; i < grid.length; i++){
    for(var o = 0; o < grid[i].length; o++){
      ellipse(grid[i][o].x-5, grid[i][o].y+sin(t/10 + grid[i][o].x)*5+5, 5, 5);
      for(var p = 0; p < grid[i][o].Links.length; p++){
        line(grid[i][o].x-5, grid[i][o].y+sin(t/10+grid[i][o].x)*5+5, grid[grid[i][o].Links[p].i][grid[i][o].Links[p].o].x-5, grid[grid[i][o].Links[p].i][grid[i][o].Links[p].o].y+sin(t/10+grid[grid[i][o].Links[p].i][grid[i][o].Links[p].o].x)*5+5);
      }
    }
  }
  t++;
}