var Chars = [{s:50, x:400, y:400, i:0, o:0, a:0}];


var Dot = function(x1,y1,x2,y2,x3,y3,x4,y4){
  return ((x2-x1)*(x4-x3) + (y2-y1)*(y4-y3));
}

var ADiff = function(x1,y1,x2,y2,x3,y3,x4,y4){
  var dot = Dot(x1,y1,x2,y2,x3,y3,x4,y4);
  var d1 = dist(x1,y1,x2,y2);
  var d2 = dist(x3,y3,x4,y4);
  var dd = d1*d2;
  if(dd === 0){
    return 0;
  }
  return acos(dot/(dd));
}

var newChar = function(l, c, p, p2){
  var L = Letters[l];
  var C = Chars[c];
  var P = Letters[C.i].points[p];
  var P2 = L.points[p2];
  
  var x2 = C.x - Letters[C.i].points[C.o].x*C.s;
  var y2 = C.y - Letters[C.i].points[C.o].y*C.s;
  
  //var A = findAngle(C.x, C.y, x2 + P.x*C.s, y2 + P.y*C.s) + C.a - 90;
  //var d = dist(C.x, C.y, x2 + P.x*C.s, y2 + P.y*C.s);
  
  //var A2 = findAngle(C.x, C.y, x2 + (P.x + P.ax)*C.s, y2 + (P.y + P.ay)*C.s) + C.a - 90;
  //var d2 = dist(C.x, C.y, x2 + (P.x + P.ax)*C.s, y2 + (P.y + P.ay)*C.s);
    
  var point1 = getRotated(C.s, C.x, C.y, x2, y2, C.i, C.o, p, C.a);
  var point2 = getRotatedL(C.s, C.x, C.y, x2, y2, C.i, C.o, p, C.a);
  
  //fill(255);
  //ellipse(point1.x, point1.y, 5, 5);
  
  var Angle = ADiff(point1.x, point1.y, point2.x, point2.y, 0, 0, P2.ax, P2.ay);
  
  var Out = {s:50, x:point1.x, y:point1.y, i:l, o:p2, a:Angle + 180};
  
  var x22 = Out.x - Letters[Out.i].points[Out.o].x*Out.s;
  var y22 = Out.y - Letters[Out.i].points[Out.o].y*Out.s;
  var point12 = getRotated(Out.s, Out.x, Out.y, x22, y22, Out.i, Out.o, p2, Out.a);
  var point22 = getRotatedL(Out.s, Out.x, Out.y, x22, y22, Out.i, Out.o, p2, Out.a);
  //print(Angle);
  var AA = ADiff(point1.x, point1.y, point2.x, point2.y, point12.x, point12.y, point22.x, point22.y);
  //print("" + AA);
  if(AA > 1 && abs(AA - 180) > 1){
    Angle *= -1;
    //print("done");
  }
  //print(Angle);
  
  return {s:50, x:point1.x, y:point1.y, i:l, o:p2, a:Angle + 180};
};

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  for(var i = 0; i < 0; i++){
    var Let = int(random(0,Letters.length - 1));
    var cc = int(random(0,Chars.length - 1));
    var ccL = Letters[Chars[cc].i];
    var LetL = Letters[Let];
    var ccLp = ccL.Connectors[int(random(0,ccL.Connectors.length - 1))];
    var LetLp = LetL.Connectors[int(random(0,LetL.Connectors.length - 1))];
    Chars.push(newChar(Let, cc, ccLp, LetLp));
  }
  //Chars.push(newChar(1, 1, 0, 15));
  //Chars.push(newChar(2, 0, 0, 20));
}

var Scale = 200;
var X = 200;
var Y = 200;
var Letters = [];
var LetterI = 0;
var t = 20;
var dc = false;
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
], 
Connectors: 
[ 
0, 1 
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
], 
Connectors: 
[ 
12, 13, 14, 15, 16 
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
], 
Connectors: 
[ 
10, 20 
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

var drawRotated = function(s, x, y, i, o, a){
  textSize(s);
  var x2 = x - Letters[i].points[o].x*s;
  var y2 = y - Letters[i].points[o].y*s;
  push();
  translate(x, y);
  rotate(a);
  translate(-x, -y);
  text(Letters[i].Char, x2, y2);
  fill(255);
  pop();
  //ellipse(x,y,5,5);
  for(let I = 0; I < Letters[i].points.length; I++){
    let p = Letters[i].points[I];
    //fill(255);
    //stroke(255);
    noStroke();
    noFill();
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
    
    //ellipse(p1.x, p1.y, 5,5);
    //line(p1.x, p1.y, p2.x, p2.y);
    
    //ellipse(x + cos(A)*d, y + sin(A)*d, 5, 5);
    //line(x + cos(A)*d, y + sin(A)*d, x + cos(A2)*d2, y + sin(A2)*d2);
    
    //ellipse(x2 + p.x*s, y2 + p.y*s, 5, 5);
    //line(x2 + p.x*s, y2 + p.y*s, x2 + (p.x + p.ax)*s, y2 + (p.y + p.ay)*s);
  }
  fill(0);
  textSize(12);
  //text(findAngle(x, y, mouseX, mouseY), x, y + 60);
}

var ps = [];
function draw() {
  
  background(220, 220, 220, 5);
  for(var i = 0; i < 100; i++){
    var Let = int(random(0,Letters.length - 1));
    var cc = int(random(0,Chars.length - 1));
    var ccL = Letters[Chars[cc].i];
    var LetL = Letters[Let];
    var ccLp = ccL.Connectors[int(random(0,ccL.Connectors.length - 1))];
    var LetLp = LetL.Connectors[int(random(0,LetL.Connectors.length - 1))];
    var nch = newChar(Let, cc, ccLp, LetLp);
    Chars.push(nch);
    drawRotated(nch.s, nch.x, nch.y, nch.i, nch.o, nch.a);
  }
  
  
  ps = [];
  fill(0);
  textSize(12);
  for(var i = 0; i < Letters.length; i++){
    //text(Letters[i].Char, 20, i*12 + 20);
  }
  textSize(Scale);
  //text(Letters[LetterI].Char, X, Y);
  for(let i = 0; i < Letters[LetterI].points.length; i++){
    let p = Letters[LetterI].points[i];
    fill(255);
    stroke(255);
    if(p.Connector){
      fill(255, 0, 0);
      stroke(255, 0, 0);
    }
    if(dist(X + p.x*Scale, Y + p.y*Scale, mouseX, mouseY) < 5){
      ps.push(i);
    }
    //ellipse(X + p.x*Scale, Y + p.y*Scale, 5, 5);
    //line(X + p.x*Scale, Y + p.y*Scale, X + (p.x + p.ax)*Scale, Y + (p.y + p.ay)*Scale);
  }
  stroke(0);
  fill(255);
  if(mouseIsPressed && mouseButton === LEFT && dist(mouseX, mouseY, 770, 770) < 30 && t < 0){
    LetterI++;
    t = 20;
    fill(0);
    dc = false;
  }
  //ellipse(770, 770, 60, 60);
  fill(255);
  if(mouseIsPressed && mouseButton === LEFT && dist(mouseX, mouseY, 770, 30) < 30 && t < 0){
    Letters[LetterI].points = [];
    t = 20;
    fill(0);
    dc = false;
  }
  //ellipse(770, 30, 60, 60);
  
  if(LetterI >= Letters.length){
    LetterI = 0;
  }
  textSize(24);
  fill(0);
  //text(Letters[LetterI].points.length, 30, 780);
  //text(keyCode, 70, 780);
  if(keyIsPressed && keyCode === 80 && t < 0){
    var arr = [];
    for(let i = 0; i < Letters[LetterI].points.length; i++){
      if(Letters[LetterI].points[i].Connector === true){
        arr.push(i);
      }
    }
    print("\{");
    print("Char: \'" + Letters[LetterI].Char + "\',");
    print("points:");
    print("\[");
    for(let i = 0; i < Letters[LetterI].points.length; i++){
    let p = Letters[LetterI].points[i];
      let t = ",";
      if(i === Letters[LetterI].points.length - 1){
        t = "";
      }
      print("{x: " + p.x + ", y: " + p.y + ", ax: " + p.ax + ", ay: " + p.ay + ", Connector: " + p.Connector + "}" + t);
    }
    print("\],");
    print("Connectors:");
    print("\[");
    var pr = "";
    for(let i = 0; i < arr.length; i++){
      var tmp = ", ";
      if(i === arr.length - 1){
        tmp = "";
      }
      pr += arr[i] + tmp;
    }
    print(pr);
    print("\]");
    print("\}");
    t = 20;
  }
  t--;
  //drawRotated(100, 400, 400, 2, 20, findAngle(400, 400, mouseX, mouseY));
  for(var i = 0; i < 0/*Chars.length*/; i++){
    fill(0);
    stroke(0);
    //drawRotated(Chars[i].s, Chars[i].x, Chars[i].y, Chars[i].i, Chars[i].o, Chars[i].a);
  }
  var tx = "";
  for(var i = 0; i < ps.length; i++){
    var temp = ", ";
    if(i == ps.length - 1){
      temp = "";
    }
    tx += "" + ps[i] + temp;
  }
  textSize(12);
  fill(0);
  text(tx, 200, 500);
}
/*

*/