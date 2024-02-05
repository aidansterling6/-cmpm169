var ManualTargetEnergy = 5;
var useTargetEnergy = false;
var gravity = 0.3;
var Speed = 1;
var crop = 0;
var Brick = false;


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
    ellipse(x + X, y, sqrt(300-(i*i))/4, 5);
    //translate(-x, -y);
    pop();
  }
  var r = 100;
  return get(200 - r, 200 - r, 2*r, 2*r);
};
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
    
}
  for(var i = 0; i < ball.length; i++){
    //draw balls
    fill(ball[i].color);
    noStroke();
    push();
    translate(ball[i].x,ball[i].y);
    scale(25/(sqrt(1000*1.3)));
    translate(-ball[i].x,-ball[i].y);
    Globe(ball[i].x,ball[i].y);
    //translate(ball[i].x,ball[i].y);
    pop();
    //ellipse(ball[i].x,ball[i].y,ball[i].s,ball[i].s);
  }
};

function setup() {
  createCanvas(800, 800);
  block.push({x:-width/2,y:height - crop,w:width * 2,h:height * 2});
block.push({x:-width/2,y:-height * 2 + crop,w:width * 2,h:height * 2});

block.push({x:width - crop,y:-height/2,w:width * 2,h:height * 2});
block.push({x:-width * 2 + crop,y:-height/2,w:width * 2,h:height * 2});
  for(var i = 0; i < 20; i++){
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
    ball.push({x:random(40,760),y:random(40,760),ax:random(-3,3),ay:random(-3,3),s:75, color:Color});
  }
}
var totalKe = 0;
var totalPe = 0;
var targetEnergy = 0;
var tested = false;
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
  background(0, 0, 0, 100);
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
  }
  //rect(0, height - 50/2 - crop, 800, 2);
  //Speed = round(mouseY/height)*10;
 //if(mouseY > height - 100){
 //   Speed = 100;
  //}
}
}