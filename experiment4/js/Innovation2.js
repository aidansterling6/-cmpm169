var vert = 
`
// (thank you to Adam Ferriss for the foundation of these example shaders)
// position information that is used with gl_Position
attribute vec3 aPosition;

// texture coordinates
attribute vec2 aTexCoord;

// the varying variable will pass the texture coordinate to our fragment shader
varying vec2 vTexCoord;

void main() {
  // assign attribute to varying, so it can be used in the fragment
  vTexCoord = aTexCoord;

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`
var frag = 
`
precision highp float;
precision highp int;

uniform float warp;
uniform float mouseSize;
uniform vec2 mousePos;
uniform int numPoints;
uniform float XArray[50];
uniform float YArray[50];
uniform float ColorArrayR[50];
uniform float ColorArrayG[50];
uniform float ColorArrayB[50];
uniform sampler2D tex0;
varying vec2 vTexCoord;

void main() {
  // now because of the varying vTexCoord, we can access the current texture coordinate
  float mouseSplit = 0.0;
  float splitVec[50];
  float SumSplit = 0.0;
  float count = 0.0;
  float ColorSumR = 0.0;
  float ColorSumG = 0.0;
  float ColorSumB = 0.0;
  vec2 uv = vTexCoord;
  float x = uv.x-mousePos.x;
  float y = uv.y-mousePos.y;
  float dist = sqrt((x*x)+(y*y));
  float IDist = mouseSize*1.0/(50.0 * dist * dist);
  float LDist = mouseSize*1.0/(0.00001 * dist * dist * dist * dist);
    mouseSplit = IDist;
    SumSplit += IDist;
  //float minDist = IDist;
  //int minIndex = -1;
    count += 1.0;
    //if(IDist2 > 1.0){
      //IDist2 = 1.0;
    //}
    //if(LDist2 > 30.0){
    //  LDist2 = 30.0;
    //}
    ColorSumR += 1.0*LDist;
    ColorSumG += 0.0*LDist;
    ColorSumB += 0.0*LDist;
  
  //float x2 = uv.x-0.5;
  //float y2 = uv.y-0.5;
  //float dist2 = sqrt((x2*x2)+(y2*y2));
  //float IDist2 = 1.0/(100.0 * dist2 * dist2);
  //float LDist2 = 1.0 - (dist2*2.0);
  
  float sum = IDist;
  //float sum = 0.0;
  for(int i = 0; i < 50; i++){
    if(i >= numPoints){
      break;
    }
    float x2 = uv.x-XArray[i];
    float y2 = uv.y-YArray[i];
    float dist2 = sqrt((x2*x2)+(y2*y2));
    float IDist2 = 1.0/(100.0 * dist2 * dist2);
    float LDist2 = 1.0/(0.00001 * dist2 * dist2 * dist2 * dist2);
    splitVec[i] = IDist2;
    SumSplit += IDist2;
    //if(IDist2 < minDist){
    //  minDist = IDist2;
    //  minIndex = i;
    //}
    count += 1.0;
    //if(IDist2 > 1.0){
      //IDist2 = 1.0;
    //}
    //if(LDist2 > 30.0){
    //  LDist2 = 30.0;
    //}
    ColorSumR += ColorArrayR[i]*LDist2;
    ColorSumG += ColorArrayG[i]*LDist2;
    ColorSumB += ColorArrayB[i]*LDist2;
    sum = sum + IDist2;
  }
  for(int i = 0; i < 50; i++){
    if(i >= numPoints){
      break;
    }
    splitVec[i] /= SumSplit;
  }
  mouseSplit /= SumSplit;
  vec2 sumVec = vec2(0, 0);
  float Total = 0.0;
  for(int i = 0; i < 50; i++){
    if(i >= numPoints){
      break;
    }
    float x2 = uv.x-XArray[i];
    float y2 = uv.y-YArray[i];
    sumVec += vec2(x2*splitVec[i], y2*splitVec[i]);
  }
  float X = uv.x-mousePos.x;
  float Y = uv.y-mousePos.y;
  sumVec += vec2(X*mouseSplit, Y*mouseSplit);
  float fval = 0.0;
  //if(IDist + IDist2 > 0.7){
  //  fval = 1.0;
  //}
  if(sum > 10.0){
    fval = 1.0;
  }
  float maxcolor = 0.0;
  if(ColorSumR > maxcolor){
    maxcolor = ColorSumR;
  }
  if(ColorSumG > maxcolor){
    maxcolor = ColorSumG;
  }
  if(ColorSumB > maxcolor){
    maxcolor = ColorSumB;
  }
  //ColorSumR = ColorSumR/maxcolor;
  //ColorSumG = ColorSumG/maxcolor;
  //ColorSumB = ColorSumB/maxcolor;
  ColorSumR = ColorSumR/count;
  ColorSumG = ColorSumG/count;
  ColorSumB = ColorSumB/count;
  ColorSumR = ColorSumR/maxcolor;
  ColorSumG = ColorSumG/maxcolor;
  ColorSumB = ColorSumB/maxcolor;
  vec4 finalColor = vec4(20.0*ColorSumR, 20.0*ColorSumG, 20.0*ColorSumB, 1.0);
  // and now these coordinates are assigned to the color output of the shader
  if(fval == 1.0){
    vec2 fin = vec2(vTexCoord.x + sumVec.x*warp, vTexCoord.y + sumVec.y*warp);
    vec4 final = texture2D(tex0, 1.0-fin)*0.8;
    final = (final + finalColor)/2.0;
    final.a = 1.0;
    gl_FragColor = final;
    //gl_FragColor = finalColor;
  }
  else{
    gl_FragColor = texture2D(tex0, 1.0-vTexCoord);
  }
}
`
//scroll to change mouse ball size
//up and down array keys to change amout of warping and its direction
//make sure to click before pressing any keys
//if its laggy, waiting a few seconds will usualy fix it (like 15)
var ManualTargetEnergy = 5;
var useTargetEnergy = false;
var gravity = 0.1;
var Speed = 1;
var crop = 0;
var Brick = false;
var warp = 0.5;
var scrollDelta = 0;
var ballCount = 40;
function mouseWheel(event) { 
    scrollDelta = event.delta;
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
//changes positive and negative numbers to 1 and -1
var sgn = function(num){
if(num < 0){
    return -1;
}
return 1;
};
//bounce friction for balls and blocks
//var BLoss = 0.9;
//var BLoss2 = 0.5;
var BLoss = 1;
var BLoss2 = 1;
//air resistance
var fairLoss = 1;
//var fairLoss = 0.99;
var airLoss = fairLoss;
//var WallS = 0.7;
var WallS = 1;
//amount of time after collision were you can still jump
var jumpLim = 5;
var jumpt = 5;
//if you are touching an object
var Jump = false;
var JumpD = 0;
//calculates speed after collision
var Ball = function(x1,y1,sx1,sy1,s1,x2,y2,sx2,sy2,s2/*,m1,m2,type*/){
var m1 = 1;
var m2 = 1;
var type = "bounce";
var Dist = dist(x1,y1,x2,y2);
var out = {x1:0,y1:0,x2:0,y2:0};
if(Dist !== 0){
var x3 = x1 + (x2 - x1)/Dist*50/2;
var y3 = y1 + (y2 - y1)/Dist*50/2;
var xy = lineS((x2 + sx2) - (y2 - y1)/Dist*100,(y2 + sy2) + (x2 - x1)/Dist*100,(x2 + sx2) + (y2 - y1)/Dist*100,(y2 + sy2) - (x2 - x1)/Dist*100,x1,y1,x2,y2);
var xy2 = lineS((x1 + sx1) - (y2 - y1)/Dist*100,(y1 + sy1) + (x2 - x1)/Dist*100,(x1 + sx1) + (y2 - y1)/Dist*100,(y1 + sy1) - (x2 - x1)/Dist*100,x1,y1,x2,y2);

var sv1 = {x:xy.x - x2,y:xy.y - y2};
var sh1 = {x:(x2 + sx2) - xy.x,y:(y2 + sy2) - xy.y};

var sv2 = {x:xy2.x - x1,y:xy2.y - y1};
var sh2 = {x:(x1 + sx1) - xy2.x,y:(y1 + sy1) - xy2.y};

out = {nax1:sv1.x,nay1:sv1.y,pax1:sh2.x,pay1:sh2.y,nax2:sv2.x,nay2:sv2.y,pax2:sh1.x,pay2:sh1.y};
}
return out;
};
//array of balls
var ball = [];
//array of blocks
var block = [];
//creats brick texture
var brick = function(x,y,w,h){
     noFill();
    noStroke();
    var H = 10;
    var W = 20;
    fill(148, 148, 148);
    rect(x,y,w + 1,h);
    fill(107, 107, 107);
    stroke(82, 82, 82);
    var sx = x;
    var ex = x;
    var sy = y;
    var ey = y;
    var X = camX - 200;
    var Y = camY - 200;
    if(sx - X < -20){
        sx = -20 + X;
    }
    if(ex - X < 420){
        ex = 420 + X;
    }
    if(sy - Y < -20){
        sy = -20 + Y;
    }
    if(ey - Y < 420){
        ey = 420 + Y;
    }
    for(var y1 = 0; y1 < h;y1 += H){
        if(y + y1 >= sy && y + y1 <= ey){
        line(x,y + y1,x + w,y + y1);
        }
    }
    for(var y1 = 0; y1 < h;y1 += H){
        var x2 = 0;
        if(y1/H/2 === round(y1/H/2)){
            x2 = W/2;
        }
        for(var x1 = x; x1 < x + w;x1 += W){
            if(x1 + x2 >= sx && x1 + x2 <= ex){
                if(y + y1 >= sy && y + y1 <= ey){
                    if(x1 + x2 < x + w){
                        var b = y + y1 + H;
                        if(b > y + h){
                            b = y + h;
                        }
            line(x1 + x2,y + y1 + 1,x1 + x2,b);
                    }
                }
            }
        }
    }
};
//draws blocks
var blocks = function(){
for(var i = 0; i < block.length;i++){
    fill(0, 0, 0);
    stroke(0, 0, 0);
    //text(i,block[i].x,block[i].y);
    if(Brick){
    brick(block[i].x,block[i].y,block[i].w,block[i].h);
    }
    else{
        rect(block[i].x,block[i].y,block[i].w,block[i].h);
    }
}
};
//current checkpoint
var check = 0;
//array of checkpoints
var checkPoint = [];
//current level
var currentLevel = -1;
//number of levels - 1
var lastLevel = 2;
//draws and controls balls, made before contest
var balls = function(){
for(var i = 0; i < ball.length;i++){
    //move
    ball[i].x += ball[i].ax;
    ball[i].y += ball[i].ay;
    //add air resistance
    ball[i].ax *= airLoss;
    ball[i].ay *= airLoss;
    //gravity
    ball[i].ay += gravity;
    var bb = false;
    //block collisions
    for(var o = 0; o < block.length;o++){
        if(ball[i].x >= block[o].x && ball[i].x <= block[o].x + block[o].w && ball[i].y > block[o].y - ball[i].s/2 && ball[i].y < block[o].y + block[o].h/2){
            ball[i].y = block[o].y - ball[i].s/2;
        ball[i].ay = -BLoss2*abs(ball[i].ay);
        ball[i].ax *= BLoss2;
        }
        else if(ball[i].x >= block[o].x && ball[i].x <= block[o].x + block[o].w && ball[i].y < block[o].y + block[o].h + ball[i].s/2 && ball[i].y > block[o].y + block[o].h/2){
            ball[i].y = block[o].y + block[o].h + ball[i].s/2;
        ball[i].ay = BLoss2*abs(ball[i].ay);
        ball[i].ax *= BLoss2;
        }
        else if(ball[i].y >= block[o].y && ball[i].y <= block[o].y + block[o].h && ball[i].x > block[o].x - ball[i].s/2 && ball[i].x < block[o].x + block[o].w/2){
            ball[i].x = block[o].x - ball[i].s/2;
        ball[i].ax = -BLoss2*abs(ball[i].ax);
        ball[i].ay *= WallS;
        }
        else if(ball[i].y >= block[o].y && ball[i].y <= block[o].y + block[o].h && ball[i].x < block[o].x + block[o].w + ball[i].s/2 && ball[i].x > block[o].x + block[o].w/2){
            ball[i].x = block[o].x + block[o].w + ball[i].s/2;
        ball[i].ax = BLoss2*abs(ball[i].ax);
        ball[i].ay *= WallS;
        }
        else{
        if(dist(ball[i].x,ball[i].y,block[o].x,block[o].y) < ball[i].s/2){
            for(var t = 0; t < ball[i].s/2;t++){
                if(dist(ball[i].x,ball[i].y,block[o].x,block[o].y) < ball[i].s/2){
                    ball[i].x += (ball[i].x - block[o].x)/dist(ball[i].x,ball[i].y,block[o].x,block[o].y);
                    ball[i].y += (ball[i].y - block[o].y)/dist(ball[i].x,ball[i].y,block[o].x,block[o].y);
                }
            }
            var temp = Ball(ball[i].x,ball[i].y,ball[i].ax,ball[i].ay,ball[i].s,block[o].x,block[o].y,-ball[i].ax,-ball[i].ay,10);
            ball[i].ax = BLoss2*(temp.nax1 + temp.pax1);
            ball[i].ay = BLoss2*(temp.nay1 + temp.pay1);
        }
        if(dist(ball[i].x,ball[i].y,block[o].x + block[o].w,block[o].y) < ball[i].s/2){
            for(var t = 0; t < ball[i].s/2;t++){
                if(dist(ball[i].x,ball[i].y,(block[o].x + block[o].w),block[o].y) < ball[i].s/2){
                    ball[i].x += (ball[i].x - (block[o].x + block[o].w))/dist(ball[i].x,ball[i].y,(block[o].x + block[o].w),block[o].y);
                    ball[i].y += (ball[i].y - block[o].y)/dist(ball[i].x,ball[i].y,(block[o].x + block[o].w),block[o].y);
                }
            }
            var temp = Ball(ball[i].x,ball[i].y,ball[i].ax,ball[i].ay,ball[i].s,block[o].x + block[o].w,block[o].y,-ball[i].ax,-ball[i].ay,10);
            ball[i].ax = BLoss2*(temp.nax1 + temp.pax1);
            ball[i].ay = BLoss2*(temp.nay1 + temp.pay1);
        }
        if(dist(ball[i].x,ball[i].y,block[o].x,block[o].y + block[o].h) < ball[i].s/2){
            for(var t = 0; t < ball[i].s/2;t++){
                if(dist(ball[i].x,ball[i].y,(block[o].x),block[o].y + block[o].h) < ball[i].s/2){
                    ball[i].x += (ball[i].x - (block[o].x))/dist(ball[i].x,ball[i].y,(block[o].x),block[o].y + block[o].h);
                    ball[i].y += (ball[i].y - (block[o].y + block[o].h))/dist(ball[i].x,ball[i].y,(block[o].x),block[o].y + block[o].h);
                }
            }
            var temp = Ball(ball[i].x,ball[i].y,ball[i].ax,ball[i].ay,ball[i].s,block[o].x,block[o].y + block[o].h,-ball[i].ax,-ball[i].ay,10);
            ball[i].ax = BLoss2*(temp.nax1 + temp.pax1);
            ball[i].ay = BLoss2*(temp.nay1 + temp.pay1);
        }
        if(dist(ball[i].x,ball[i].y,block[o].x + block[o].w,block[o].y + block[o].h) < ball[i].s/2){
            for(var t = 0; t < ball[i].s/2;t++){
                if(dist(ball[i].x,ball[i].y,(block[o].x + block[o].w),block[o].y + block[o].h) < ball[i].s/2){
                    ball[i].x += (ball[i].x - (block[o].x + block[o].w))/dist(ball[i].x,ball[i].y,(block[o].x + block[o].w),block[o].y + block[o].h);
                    ball[i].y += (ball[i].y - (block[o].y + block[o].h))/dist(ball[i].x,ball[i].y,(block[o].x + block[o].w),block[o].y + block[o].h);
                }
            }
            var temp = Ball(ball[i].x,ball[i].y,ball[i].ax,ball[i].ay,ball[i].s,block[o].x + block[o].w,block[o].y + block[o].h,-ball[i].ax,-ball[i].ay,10);
            ball[i].ax = BLoss2*(temp.nax1 + temp.pax1);
            ball[i].ay = BLoss2*(temp.nay1 + temp.pay1);
        }
        }
    }
    //ball collisions
    for(var o = 0; o < ball.length;o++){
        if(i !== o){
            if(dist(ball[i].x,ball[i].y,ball[o].x,ball[o].y) < (ball[i].s + ball[o].s)/2){
                for(var t = 0; t < (ball[i].s + ball[o].s)/2;t++){
                    if(dist(ball[i].x,ball[i].y,ball[o].x,ball[o].y) <= (ball[i].s + ball[o].s)/2){
                ball[i].x += (ball[i].x - ball[o].x)/dist(ball[i].x,ball[i].y,ball[o].x,ball[o].y);
                ball[i].y += (ball[i].y - ball[o].y)/dist(ball[i].x,ball[i].y,ball[o].x,ball[o].y);
            }
                }
                var New = Ball(ball[i].x,ball[i].y,ball[i].ax,ball[i].ay,ball[i].s,ball[o].x,ball[o].y,ball[o].ax,ball[o].ay,ball[o].s);
                if(ball[i].x !== ball[o].x){
                ball[i].ax = BLoss*(New.nax1 + New.pax1);
                ball[i].ay = BLoss*(New.nay1 + New.pay1);
                ball[o].ax = BLoss*(New.nax2 + New.pax2);
                ball[o].ay = BLoss*(New.nay2 + New.pay2);
                }
                else{
                    ball[i].ay = -BLoss*ball[i].ay/2;
                    ball[o].ay = -BLoss*ball[o].ay/2;
                }
            }
        }
    }
    //draw balls
    //fill(ball[i].color);
    //noStroke();
    //ellipse(ball[i].x,ball[i].y,ball[i].s,ball[i].s);
}
};
function preload() {
  //TestShader = loadShader('shader.vert', 'shader.frag');
}
function setup() {
  createCanvas(800, 800, WEBGL);
  TestShader = createShader(vert, frag);
  //TestShader = loadShader('shader.vert', 'shader.frag');
  cam = createCapture(VIDEO);
  cam.size(710, 400);
  cam.hide();
  block.push({x:-width/2,y:height - crop,w:width * 2,h:height * 2});
  block.push({x:-width/2,y:-height * 2 + crop,w:width * 2,h:height * 2});

  block.push({x:width - crop,y:-height/2,w:width * 2,h:height * 2});
  block.push({x:-width * 2 + crop,y:-height/2,w:width * 2,h:height * 2});
  for(var i = 0; i < ballCount/*20*/; i++){
    var Color = color(0,0,0);
    var Rand = round(random(0,5));
    if(Rand === 0){
      Color = color(random(230,255), random(0,60), random(0,60));
    } else if(Rand === 1){
      Color = color(random(0,60), random(230,255), random(0,60));
    } else if(Rand === 2){
      Color = color(random(0,60), random(0,60), random(230,255));
    } else if(Rand === 3){
      Color = color(random(230,255), random(0,60), random(230,255));
    } else if(Rand === 4){
      Color = color(random(0,60), random(230,255), random(230,255));
    } else if(Rand === 5){
      Color = color(random(230,255), random(230,255), random(0,60));
    }
    ball.push({x:random(40,760),y:random(40,760),ax:random(-3,3),ay:random(-3,3),s:50, color:Color});
  }
}
var totalKe = 0;
var totalPe = 0;
var targetEnergy = 0;
var tested = false;
var XArray = [];
var YArray = [];
var ColorArrayR = [];
var ColorArrayG = [];
var ColorArrayB = [];
var mouseSize = 1.0;
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
   for(var t = 0; t < Speed; t++){
  if(tested === false){
    totalKe = 0;
    totalPe = 0;
    for(var i = 0; i < ball.length; i++){
      totalKe += 0.5*1*dist(ball[i].ax, ball[i].ay, 0, 0)*dist(ball[i].ax, ball[i].ay, 0, 0);
      totalPe += 1*gravity*(800-ball[i].y);
    }
    targetEnergy = totalPe + totalKe;
    tested = true;
    //manual setting
    if(useTargetEnergy){
      targetEnergy = ManualTargetEnergy*ball.length;
    }
  }
  background(255, 255, 255, 100);
  //call ball function
    balls();
    //call block function
    blocks();
  totalKe = 0;
  totalPe = 0;
  for(var i = 0; i < ball.length; i++){
    totalKe += 0.5*1*dist(ball[i].ax, ball[i].ay, 0, 0)*dist(ball[i].ax, ball[i].ay, 0, 0);
    totalPe += 1*gravity*(800-ball[i].y);
  }
  fill(255);
  //text(targetEnergy, 50, 30);
  //text(totalPe, 200, 30);
  //text(totalKe, 350, 30);
  fill(255);
  //text(totalPe + totalKe, 550, 30);
  //rect(10,height,10,-(totalPe + totalKe)/(mouseY/200));
  //rect(0,height,10,-(targetEnergy)/(mouseY/200));
  var KeTarget = targetEnergy - totalPe;
  var KeDiff = KeTarget - totalKe;
  //text(KeDiff, 550, 50);
  var VDiff = sqrt(abs(KeDiff*2));
  //text(VDiff, 550, 70);
  var Vsign = 1;
  if(KeDiff < 0){
    Vsign = -1;
  }
  var PVDiff = (VDiff*Vsign*0.05)/ball.length;
  for(var i = 0; i < ball.length; i++){
    var newV = dist(ball[i].ax, ball[i].ay, 0, 0)+PVDiff;
    ball[i].ax = (ball[i].ax/dist(ball[i].ax, ball[i].ay, 0, 0))*newV;
    ball[i].ay = (ball[i].ay/dist(ball[i].ax, ball[i].ay, 0, 0))*newV;
    if(ball[i].x < crop + ball[i].s/2){
      ball[i].x = crop + ball[i].s/2;
    }
    if(ball[i].x > width - ball[i].s/2 - crop){
      ball[i].x = width - ball[i].s/2 - crop;
    }
    if(ball[i].y < crop + ball[i].s/2){
      ball[i].y = crop + ball[i].s/2;
    }
    if(ball[i].y > height - ball[i].s/2 - crop){
      ball[i].y = height - ball[i].s/2 - crop;
    }
  }
    shader(TestShader);
     //ball[0].x = mouseX;
     //ball[0].y = mouseY;
    TestShader.setUniform('mousePos', [float(mouseX/width), float(1 - (mouseY/height))]);
    TestShader.setUniform('numPoints', ball.length);
    for(var i = 0; i < ball.length; i++){
      while(XArray.length - 1 < i){
        XArray.push(0);
        YArray.push(0);
        ColorArrayR.push(0);
        ColorArrayG.push(0);
        ColorArrayB.push(0);
      }
      XArray[i] = float(ball[i].x/width);
      YArray[i] = float(1-(ball[i].y/height));
      ColorArrayR[i] = float(red(ball[i].color)/255);
      ColorArrayG[i] = float(green(ball[i].color)/255);
      ColorArrayB[i] = float(blue(ball[i].color)/255);
    }
    TestShader.setUniform('warp', float(warp));
    TestShader.setUniform('mouseSize', float(mouseSize));
    TestShader.setUniform('XArray', XArray);
    TestShader.setUniform('YArray', YArray);
    TestShader.setUniform('ColorArrayR', ColorArrayR);
    TestShader.setUniform('ColorArrayG', ColorArrayG);
    TestShader.setUniform('ColorArrayB', ColorArrayB);
    TestShader.setUniform('tex0', cam);
    rect(0,0,width, height);
     if(keyIsPressed && keyCode === 65){
       mouseSize *= 0.9;
     }
     if(keyIsPressed && keyCode === 68){
       mouseSize *= 1.1;
     }
     if(keyIsPressed && keyCode === 87){
       warp += 0.1;
     }
     if(keyIsPressed && keyCode === 83){
       warp -= 0.1;
     }
     //if(warp < 0){
     //  warp = 0;
     //}
     scrollDelta = 0;
  }
  //rect(0, height - 50/2 - crop, 800, 2);
  //Speed = round(mouseY/height)*10;
 //if(mouseY > height - 100){
 //   Speed = 100;
  //}
}
}