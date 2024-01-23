var w = 40;
var h = 40;

var grid = [];
var ripples = [];
var rand = 0.25;
function setup() {
  createCanvas(800, 800);
  for(var i = 0; i < w; i++){
    grid.push([]);
  }
  for(var i = 0; i < grid.length; i++){
    for(var o = 0; o < h; o++){
      
      grid[i].push({x:(i + random(-rand, rand))*20 + 10, y:(o + random(-rand, rand))*20 + 10, xs:0, ys:0, Links:[], color:{r:random(0,255), b:random(0,255), g:random(0,255)}});
    }
  }
  for(var i = 0; i < grid.length; i++){
    for(var o = 0; o < grid[i].length; o++){
      for(var x = 0; x <= 1; x++){
        for(var y = 0; y <= 1; y++){
          if(x !== 0 && y !== 0 && i + x >= 0 && i + x < grid.length && o + y >= 0 && o + y < grid[i].length){
            grid[i][o].Links.push({i:i + x, o:o + y, InitDist:dist(grid[i][o].x, grid[i][o].y, grid[i+x][o+y].x,grid[i+x][o+y].y)});
          }
        }
      }
      for(var x = 0; x <= 1; x++){
        for(var y = -1; y <= 0; y++){
          if(x !== 0 && y !== 0 && i + x >= 0 && i + x < grid.length && o + y >= 0 && o + y < grid[i].length){
            grid[i][o].Links.push({i:i + x, o:o + y, InitDist:dist(grid[i][o].x, grid[i][o].y, grid[i+x][o+y].x,grid[i+x][o+y].y)});
          }
        }
      }
    }
  }
}
var t = 0;
var T = 0;
var A = 1/15;
var started = false;
function draw() {
  if(!focused && started === false){
    background(150, 150, 150);
    fill(0, 0, 0);
    noStroke();
    textSize(30);
    text("Click to start", 200, 200);
    started = true;
  }
  if(focused){
  //background(255, 255, 255, 10);
  background(0, 0, 0, 10);
  stroke(0, 0, 0);
  fill(0,0,0);
  for(var i = 0; i < grid.length; i++){
    for(var o = 0; o < grid[i].length; o++){
      grid[i][o].xs = 0;
      grid[i][o].ys = 0;
      for(var p = 0; p < ripples.length; p++){
        var Dist = dist(grid[i][o].x, grid[i][o].y, ripples[p].x, ripples[p].y);
        var ShiftVar = (Dist - ripples[p].r);
        var shift = -sin(ShiftVar*A)*10;
        if(Dist !== 0 && ripples[p].r - PI/A <= Dist && Dist <= (ripples[p].r)){
          grid[i][o].xs += shift*((grid[i][o].x - ripples[p].x)/Dist);
          grid[i][o].ys += shift*((grid[i][o].y - ripples[p].y)/Dist);
        }
      }
      for(var p = 0; p < grid[i][o].Links.length; p++){
        stroke(0,0,0);
        //line(grid[i][o].x + grid[i][o].xs + cos(grid[i][o].y + t/9 + 1241)*5, grid[i][o].y + grid[i][o].ys+sin(t/10+grid[i][o].x)*5, grid[grid[i][o].Links[p].i][grid[i][o].Links[p].o].x + grid[grid[i][o].Links[p].i][grid[i][o].Links[p].o].xs + cos(grid[grid[i][o].Links[p].i][grid[i][o].Links[p].o].y + t/9 + 1241)*5, grid[grid[i][o].Links[p].i][grid[i][o].Links[p].o].y+grid[grid[i][o].Links[p].i][grid[i][o].Links[p].o].ys+sin(t/10+grid[grid[i][o].Links[p].i][grid[i][o].Links[p].o].x)*5);
      }
      fill(grid[i][o].color.r, grid[i][o].color.b, grid[i][o].color.g);
      stroke(grid[i][o].color.r, grid[i][o].color.b, grid[i][o].color.g);
      ellipse(grid[i][o].x +grid[i][o].xs + cos(grid[i][o].y + t/9 + 1241)*5, grid[i][o].y + grid[i][o].ys+sin(t/10 + grid[i][o].x)*5, 7, 7);
    }
  }
  if(mouseIsPressed && T < 0){
    ripples.push({x:mouseX, y:mouseY, r:0, d:false});
    T = 30;
  }
  for(var i = 0; i < ripples.length; i++){
    ripples[i].r += 3;
  }
  for(var i = 0; i < ripples.length; i++){
    if(ripples[i].r > 1600){
      ripples.splice(i);
    }
  }
  t++;
  T--;
  /*
  //background(255);
  var b = mouseX;
  for(var x = 0; x < 800; x += 20){
    var y = 0;
    if(b <= x && x <= (b + (PI/A))){
    y = -sin((x-b)*A)*30;
    }
    //ellipse(x, y + 200, 5, 5);
  }
  */
  }
}