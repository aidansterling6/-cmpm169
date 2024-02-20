function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
}
var Scale = 200;
var X = 200;
var Y = 200;
var Letters = [];
var LetterI = 0;
var t = 20;
var dc = false;

var Line = function(t,x1,y1,x2,y2){
  var D = dist(x1,y1,x2,y2);
  t = t%10;
  for(var i = t; i < D; i += 10){
    ellipse(x1 + ((x2-x1)/D)*i, y1 + ((y2-y1)/D)*i, 5, 5);
  }
}
//find intersection between two lines
var lineS = function(x1,y1,x2,y2,x3,y3,x4,y4){
var ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/((y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1));
var x = x1 + ua*(x2-x1);
var y = y1 + ua*(y2-y1);
if(!x || !y){
    x = 0;
    y = 0;
}
return {x:x,y:y,t:((dist(x1,y1,x,y) + dist(x,y,x2,y2)) - dist(x1,y1,x2,y2)) < 0.5 && ((dist(x3,y3,x,y) + dist(x,y,x4,y4)) - dist(x3,y3,x4,y4)) < 0.5};
};

var findAngle = function(x1, y1, x2, y2){
  var D = dist(x1,y1,x2,y2);
  if(D === 0){
    return 0;
  }
  if(x2 >= x1 && y2 <= y1){
    return asin((x2-x1)/D);
  }
  if(x2 >= x1 && y2 > y1){
    return 90 - asin((x2-x1)/D) + 90;
  }
  if(x2 < x1 && y2 > y1){
    return 180 - asin((x2-x1)/D);
  }
  return 360 + asin((x2-x1)/D);
}
var dn = -1;
Letters = [
{
Char: 'A', 
points: 
[ 
{x: 0.055, y: -0.01, ax: -0.09, ay: 0.255, Connector: true}, 
{x: 0.61, y: -0.015, ax: 0.08999999999999997, ay: 0.21500000000000002, Connector: true}, 
{x: 0.3, y: -0.675, ax: -0.245, ay: 0.665, Connector: false}, 
{x: 0.35, y: -0.675, ax: 0.26, ay: 0.66, Connector: false}, 
{x: 0.3, y: -0.675, ax: 0.04999999999999999, ay: 0, Connector: false}, 
{x: 0.145, y: -0.255, ax: 0.37, ay: 0, Connector: false} 
] 
},
{ 
Char: 'B', 
points: 
[ 
{x: 0.53, y: -0.535, ax: -0.015000000000000013, ay: -0.07999999999999996, Connector: false}, 
{x: 0.515, y: -0.615, ax: -0.07500000000000001, ay: -0.050000000000000044, Connector: false}, 
{x: 0.44, y: -0.665, ax: -0.10999999999999999, ay: -0.010000000000000009, Connector: false}, 
{x: 0.33, y: -0.675, ax: -0.2, ay: 0, Connector: false}, 
{x: 0.515, y: -0.465, ax: 0.015000000000000013, ay: -0.07, Connector: false}, 
{x: 0.44, y: -0.395, ax: 0.07500000000000001, ay: -0.07, Connector: false}, 
{x: 0.435, y: -0.37, ax: 0.09000000000000002, ay: 0.05499999999999999, Connector: false}, 
{x: 0.525, y: -0.315, ax: 0.039999999999999925, ay: 0.08000000000000002, Connector: false}, 
{x: 0.565, y: -0.235, ax: -0.004999999999999893, ay: 0.09499999999999997, Connector: false}, 
{x: 0.56, y: -0.14, ax: -0.07000000000000006, ay: 0.07500000000000001, Connector: false}, 
{x: 0.49, y: -0.065, ax: -0.09499999999999997, ay: 0.025, Connector: false}, 
{x: 0.395, y: -0.04, ax: -0.27, ay: 0, Connector: false}, 
{x: 0.125, y: -0.675, ax: 0, ay: -0.15000000000000002, Connector: true}, 
{x: 0.125, y: -0.675, ax: -0.15, ay: 0, Connector: true}, 
{x: 0.125, y: -0.045, ax: -0.16, ay: 0, Connector: true}, 
{x: 0.125, y: -0.045, ax: 0, ay: 0.16, Connector: true}, 
{x: 0.125, y: -0.37, ax: -0.17, ay: 0, Connector: true}, 
{x: 0.125, y: -0.52, ax: 0, ay: 0.47500000000000003, Connector: false}, 
{x: 0.125, y: -0.52, ax: 0, ay: -0.15500000000000003, Connector: false}, 
{x: 0.35, y: -0.37, ax: 0.09000000000000002, ay: 0, Connector: false}, 
{x: 0.35, y: -0.37, ax: 0.08999999999999997, ay: -0.024999999999999967, Connector: false}, 
{x: 0.125, y: -0.37, ax: 0.21999999999999997, ay: 0, Connector: false} 
] 
},
{ 
Char: 'C', 
points: 
[ 
{x: 0.1, y: -0.345, ax: 0, ay: -0.07500000000000001, Connector: false}, 
{x: 0.1, y: -0.345, ax: 0, ay: 0.07999999999999999, Connector: false}, 
{x: 0.1, y: -0.415, ax: 0.01999999999999999, ay: -0.09000000000000002, Connector: false}, 
{x: 0.12, y: -0.505, ax: 0.04000000000000001, ay: -0.07999999999999996, Connector: false}, 
{x: 0.16, y: -0.585, ax: 0.07999999999999999, ay: -0.07000000000000006, Connector: false}, 
{x: 0.24, y: -0.655, ax: 0.09000000000000002, ay: -0.030000000000000027, Connector: false}, 
{x: 0.33, y: -0.685, ax: 0.10999999999999999, ay: 0, Connector: false}, 
{x: 0.44, y: -0.685, ax: 0.10500000000000004, ay: 0.050000000000000044, Connector: false}, 
{x: 0.54, y: -0.635, ax: 0.05499999999999994, ay: 0.06000000000000005, Connector: false}, 
{x: 0.595, y: -0.575, ax: 0.025000000000000022, ay: 0.06499999999999995, Connector: false}, 
{x: 0.62, y: -0.51, ax: 0.025000000000000022, ay: 0.09000000000000002, Connector: true}, 
{x: 0.1, y: -0.27, ax: 0.03, ay: 0.08000000000000002, Connector: false}, 
{x: 0.13, y: -0.19, ax: 0.04000000000000001, ay: 0.075, Connector: false}, 
{x: 0.17, y: -0.115, ax: 0.06999999999999998, ay: 0.05, Connector: false}, 
{x: 0.24, y: -0.065, ax: 0.09000000000000002, ay: 0.035, Connector: false}, 
{x: 0.33, y: -0.03, ax: 0.09999999999999998, ay: 0.0049999999999999975, Connector: false}, 
{x: 0.43, y: -0.025, ax: 0.09500000000000003, ay: -0.034999999999999996, Connector: false}, 
{x: 0.525, y: -0.06, ax: 0.06999999999999995, ay: -0.065, Connector: false}, 
{x: 0.595, y: -0.125, ax: 0.025000000000000022, ay: -0.06, Connector: false}, 
{x: 0.62, y: -0.185, ax: 0.015000000000000013, ay: -0.04999999999999999, Connector: false}, 
{x: 0.635, y: -0.235, ax: 0.020000000000000018, ay: -0.10000000000000003, Connector: true} 
] 
}
];

var getRotated = function(s, x, y, x2, y2, i, o, o2, a){
  let p = Letters[i].points[o2];
  var A = findAngle(x, y, x2 + p.x*s, y2 + p.y*s) + a - 90;
  var d = dist(x, y, x2 + p.x*s, y2 + p.y*s);
  return {x: x + cos(A)*d, y: y + sin(A)*d};
}

var getRotatedL = function(s, x, y, x2, y2, i, o, o2, a){
  let p = Letters[i].points[o2];
  var A2 = findAngle(x, y, x2 + (p.x + p.ax)*s, y2 + (p.y + p.ay)*s) + a - 90;
  var d2 = dist(x, y, x2 + (p.x + p.ax)*s, y2 + (p.y + p.ay)*s);
  return {x: x + cos(A2)*d2, y: y + sin(A2)*d2};
}

var drawRotated = function(s, x, y, i, o, a, m){
  textSize(s);
  if(o !== -1){
    var x2 = x - Letters[i].points[o].x*s;
    var y2 = y - Letters[i].points[o].y*s;
  } else {
    var x2 = x;
    var y2 = y;
  }
  push();
  translate(x, y);
  rotate(a);
  translate(-x, -y);
  stroke(0);
  fill(0);
  text(Letters[i].Char, x2, y2);
  fill(255);
  pop();
  //ellipse(x,y,5,5);
  for(let I = 0; I < Letters[i].points.length; I++){
    let p = Letters[i].points[I];
    fill(255);
    stroke(255);
    if(p.Connector){
      fill(255, 0, 0);
      stroke(255, 0, 0);
    }
    var A = findAngle(x, y, x2 + p.x*s, y2 + p.y*s) + a - 90;
    var d = dist(x, y, x2 + p.x*s, y2 + p.y*s);
    
    var A2 = findAngle(x, y, x2 + (p.x + p.ax)*s, y2 + (p.y + p.ay)*s) + a - 90;
    var d2 = dist(x, y, x2 + (p.x + p.ax)*s, y2 + (p.y + p.ay)*s);
    var p1 = getRotated(s, x, y, x2, y2, i, o, I, a);
    var p2 = getRotatedL(s, x, y, x2, y2, i, o, I, a);
    fill(255);
    stroke(255);
    //ellipse(p1.x, p1.y, 5,5);
    if(!p.Connector){
      Line(m, p1.x, p1.y, p2.x, p2.y);
    }
    
    //ellipse(x + cos(A)*d, y + sin(A)*d, 5, 5);
    //line(x + cos(A)*d, y + sin(A)*d, x + cos(A2)*d2, y + sin(A2)*d2);
    
    //ellipse(x2 + p.x*s, y2 + p.y*s, 5, 5);
    //line(x2 + p.x*s, y2 + p.y*s, x2 + (p.x + p.ax)*s, y2 + (p.y + p.ay)*s);
  }
}
var ps = [];
var t = 0;
function draw() {
  ps = [];
  background(220);
  drawRotated(100, 300, 400, 0, -1, 0, t);
  drawRotated(100, 400, 400, 1, -1, 0, t);
  drawRotated(100, 500, 400, 2, -1, 0, t);
  t++;
}
/*

*/