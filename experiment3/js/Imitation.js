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
function setup() {
  createCanvas(800, 800);
  angleMode(RADIANS);
  background(220);
  Globe(200, 200);
}

function draw() {
  background(220);
  Globe(200, 200);
  var r = 100;
  var img = get(200 - r, 200 - r, 2*r, 2*r);
  //rect(0, 0, 500, 500);
  //image(img, 200, 300);
  //text(GoldenRatio, 200, 230);
  //text(GoldenAngle, 200, 240);
}