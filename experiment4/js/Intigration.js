var Globe = function(x, y){
  var GoldenRatio = (1 + sqrt(5))/2;
  var GoldenAngle = (2*PI)/GoldenRatio;
  var a = 0;
  var X = 0;
  for(var i = 0.1; i < 50; i += 0.1){
    a += GoldenAngle;
    X = 2*sqrt(1000-pow((i-sqrt(1000)),2))-1.3;
    push();
    translate(x, y);
    rotate(a);
    translate(-x, -y);
    fill(0);
    ellipse(x + X, y, sqrt(300-(i*i))/4, 5);
    //translate(-x, -y);
    pop();
  }
  var r = 100;
  return get(200 - r, 200 - r, 2*r, 2*r);
};
var ball = [];
function setup() {
  createCanvas(800, 800);
  angleMode(RADIANS);
  for(var i = 0; i < 10; i++){
    ball.push({x:random(50, 750), y:random(50,750), vx:random(-1,1), vy:random(-1,1), vr:random(-0.02,0.02), r:random(0,360)});
  }
}
function draw() {
  background(220);
  for(var i = 0; i < ball.length; i++){
    ball[i].x += ball[i].vx*2;
    ball[i].y += ball[i].vy*2;
    ball[i].r += ball[i].vr;
    var r = 110;
    if(ball[i].x < r/2){
      ball[i].vx = abs(ball[i].vx);
      ball[i].vr = random(-0.01,0.01);
    }
    if(ball[i].x > 800 - r/2){
      ball[i].vx = -abs(ball[i].vx);
      ball[i].vr = random(-0.01,0.01);
    }
    if(ball[i].y < r/2){
      ball[i].vy = abs(ball[i].vy);
      ball[i].vr = random(-0.01,0.01);
    }
    if(ball[i].y > 800 - r/2){
      ball[i].vy = -abs(ball[i].vy);
      ball[i].vr = random(-0.02,0.02);
    }
    push();
    translate(ball[i].x, ball[i].y);
    rotate(ball[i].r);
    translate(-ball[i].x, -ball[i].y);
    Globe(ball[i].x, ball[i].y);
    pop();
  }
  var r = 100;
  var img = get(200 - r, 200 - r, 2*r, 2*r);
  //rect(0, 0, 500, 500);
  //image(img, 200, 300);
  //text(GoldenRatio, 200, 230);
  //text(GoldenAngle, 200, 240);
}