//Enter RGB color and click to draw. Everyone shares the same canvas. Press space to change the shape and press r to rotate.
var inHex = function(sa, x, y, r, Cx, Cy){
  for(var a = 0; a <= 3; a++){
    var X = x + sin(a*(360/3) + sa)*r;
    var Y = y + cos(a*(360/3) + sa)*r;
    var X2 = x + sin((a + 1)*(360/3) + sa)*r;
    var Y2 = y + cos((a + 1)*(360/3) + sa)*r;
    var vx = Y2 - Y;
    var vy = -(X2 - X);
    var Dot = vx*(Cx-X) + vy*(Cy-Y);
    //line(Cx, Cy, X, Y);
    if(Dot < 0){
      return false;
    }
  }
  return true;
}
var Hex = function(sa, x, y, r){
  beginShape();
  for(var a = 0; a <= 3; a++){
    var X = x + sin(a*(360/3) + sa)*r;
    var Y = y + cos(a*(360/3) + sa)*r;
    var X2 = x + sin((a + 1)*(360/3) + sa)*r;
    var Y2 = y + cos((a + 1)*(360/3) + sa)*r;
    var vx = Y2 - Y;
    var vy = -(X2 - X);
    vertex(X, Y);
  }
  endShape();
}
var R = 15;

var NewColor = {r:0, g:0, b:0};
var In1;
var In2;
var In3;
var CBox;

var database;
const firebaseConfig = {
  apiKey: "AIzaSyD7Nphaqjo5zzlI07XfZWiTqeOIWcITBXg",
  authDomain: "experiment-7-78304.firebaseapp.com",
  databaseURL: "https://experiment-7-78304-default-rtdb.firebaseio.com",
  projectId: "experiment-7-78304",
  storageBucket: "experiment-7-78304.appspot.com",
  messagingSenderId: "410449913197",
  appId: "1:410449913197:web:e2da1aa4040b07fcb2e664",
  measurementId: "G-KZXRYD732M"
};

var Read = true;

var Data;

//var Time = 0;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  //if(!getItem('Time')){
    //storeItem('Time', Time);
  //}
  firebase.initializeApp(firebaseConfig); 
  database = firebase.database();
  var ref = database.ref('pixels3');
  ref.on('value', gotData, errData);
  
  var Tex1 = createElement('p', 'Red:');
  var Tex2 = createElement('p', 'Green:');
  var Tex3 = createElement('p', 'Blue:');
  var Tex4 = createElement('p', 'Color:');
  
  var Tex5 = createElement('p', 'Enter RGB color and click to draw. Everyone shares the same canvas. Press space to change the shape and press r to rotate.');
  
  CBox = createElement('p', '');
  
  Tex1.position(0, 783);
  Tex2.position(100, 783);
  Tex3.position(215, 783);
  Tex4.position(320, 783);
  Tex5.position(0, 800);
  CBox.position(363, 783);
  
  CBox.size(20, 20);
  CBox.style('background-color', "blue");
  
  In1 = createInput();
  In2 = createInput();
  In3 = createInput();
  In1.position(32, 800);
  In2.position(145, 800);
  In3.position(252, 800);
  In1.size(40, 12);
  In2.size(40, 12);
  In3.size(40, 12);
  In1.value('0');
  In2.value('0');
  In3.value('0');
}
function gotData (data) {
    //if(Read){
  	  //console.log(data.val());
	  var pix = data.val();
  	  print(pix);
      //Read = false;
      Data = pix;
      print(data);
    //}
}

function errData(err) {
	console.log('Error!');
  	console.log(err);
}

var SubmitPix = function(val){
  var ref = database.ref('pixels3');
  ref.set(val);
}


//var Time = 0;

var Shape = "hex";
var RotNum = 0;

var t = 0;
var T = 0;
var Updated = false;
var updates = {};
function draw() {
  if(!focused){
    background(150, 150, 150);
    fill(0, 0, 0);
    noStroke();
    textSize(30);
    text("Click to start", 200, 200);
    if(t < 10){
      t = 10;
    }
  }
  if(focused){
  textSize(12);
  background(255, 255, 255);
  //Time = getItem("Time");
  NewColor = {r:In1.value(), g:In2.value(), b:In3.value()};
  CBox.style('background-color', "rgb(" + NewColor.r + ", " + NewColor.g + ", " + NewColor.b + ")");
  //if(mouseIsPressed && t < 0){
  //  SubmitPix(random(0,5));
  //  t = 20;
  //}
  if(Data){
    for(var x = 0; x < 916; x += R){
      for(var y = 0; y < 516; y += R){
        var txt = "" + x + "_" + y;
        var Col = Data[txt];
        Col.a = 0;
      }
    }
    for(var x = 0; x < 916; x += R){
      for(var y = 0; y < 516; y += R){
        var xShift = 0;
        var ixShift = false;
        var yShift = 0;
        var iyShift = false;
        var fa = 0;
        if(y%(R*2) !== 0){
          xShift += sin(360/3)*R;
          ixShift = true;
          //fill(0);
          if(x > 890){
            continue;
          }
        }
        else{
          if(x < R){
            continue;
          }
          if(x > 900){
            continue;
          }
        }
        if(x%(R*2) !== 0){
          fa = 180;
          yShift += R*0.5;
          iyShift = true;
        }
        xShift += 5/2 - R;
        yShift += R;
        if(inHex(fa, sin(360/6)*x + xShift + R,y*1.5 + yShift,R, mouseX, mouseY)/*mouseX > x && mouseX <= x + 10 && mouseY > y && mouseY <= y + 10*/){
          //stroke(0, 0, 0, 20);
          //fill(NewColor.r, NewColor.g, NewColor.b);
          //rect(x, y, 9, 9);
          //Hex(fa, sin(360/6)*x + xShift + R,y*1.5 + yShift,R);
          if(Shape === "hex" && RotNum === 0 && ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x-2*R) + "_" + y;
            
            var txt4 = "" + (x+R) + "_" + (y-R);
            var txt5 = "" + (x) + "_" + (y-R);
            var txt6 = "" + (x-R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          if(Shape === "hex" && RotNum === 0 && ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x-2*R) + "_" + y;
            
            var txt4 = "" + (x+R) + "_" + (y+R);
            var txt5 = "" + (x) + "_" + (y+R);
            var txt6 = "" + (x-R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          if(Shape === "hex" && RotNum === 0 && !ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x-2*R) + "_" + y;
            
            var txt4 = "" + (x-R) + "_" + (y-R);
            var txt5 = "" + (x-2*R) + "_" + (y-R);
            var txt6 = "" + (x-3*R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          if(Shape === "hex" && RotNum === 0 && !ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x-2*R) + "_" + y;
            
            var txt4 = "" + (x-R) + "_" + (y+R);
            var txt5 = "" + (x-2*R) + "_" + (y+R);
            var txt6 = "" + (x-3*R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          
          if(Shape === "hex" && RotNum === 1 && ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            
            var txt4 = "" + (x) + "_" + (y+R);
            var txt5 = "" + (x+R) + "_" + (y+R);
            var txt6 = "" + (x+2*R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          if(Shape === "hex" && RotNum === 1 && ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            
            var txt4 = "" + (x) + "_" + (y-R);
            var txt5 = "" + (x+R) + "_" + (y-R);
            var txt6 = "" + (x+2*R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          if(Shape === "hex" && RotNum === 1 && !ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            
            var txt4 = "" + (x) + "_" + (y+R);
            var txt5 = "" + (x-R) + "_" + (y+R);
            var txt6 = "" + (x-2*R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          if(Shape === "hex" && RotNum === 1 && !ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            
            var txt4 = "" + (x) + "_" + (y-R);
            var txt5 = "" + (x-R) + "_" + (y-R);
            var txt6 = "" + (x-2*R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          
          if(Shape === "hex" && RotNum === 2 && ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x+R) + "_" + y;
            var txt3 = "" + (x+2*R) + "_" + y;
            
            var txt4 = "" + (x+R) + "_" + (y-R);
            var txt5 = "" + (x+2*R) + "_" + (y-R);
            var txt6 = "" + (x+3*R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          if(Shape === "hex" && RotNum === 2 && ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x+R) + "_" + y;
            var txt3 = "" + (x+2*R) + "_" + y;
            
            var txt4 = "" + (x+R) + "_" + (y+R);
            var txt5 = "" + (x+2*R) + "_" + (y+R);
            var txt6 = "" + (x+3*R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          if(Shape === "hex" && RotNum === 2 && !ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x+R) + "_" + y;
            var txt3 = "" + (x+2*R) + "_" + y;
            
            var txt4 = "" + (x-R) + "_" + (y-R);
            var txt5 = "" + (x) + "_" + (y-R);
            var txt6 = "" + (x+R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          if(Shape === "hex" && RotNum === 2 && !ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x+R) + "_" + y;
            var txt3 = "" + (x+2*R) + "_" + y;
            
            var txt4 = "" + (x-R) + "_" + (y+R);
            var txt5 = "" + (x) + "_" + (y+R);
            var txt6 = "" + (x+R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
            
            if(Data[txt4]){
              Data[txt4].a = 1;
            }
            if(Data[txt5]){
              Data[txt5].a = 1;
            }
            if(Data[txt6]){
              Data[txt6].a = 1;
            }
          }
          
          
          
          if(Shape === "trap" && RotNum === 0 && ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x+R) + "_" + y;
            var txt3 = "" + (x-R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "trap" && RotNum === 0 && ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "trap" && RotNum === 0 && !ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "trap" && RotNum === 0 && !ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          
          if(Shape === "trap" && RotNum === 1 && ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x+R) + "_" + (y-R);
            var txt3 = "" + (x-R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "trap" && RotNum === 1 && ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x+R) + "_" + (y+R);
            var txt3 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "trap" && RotNum === 1 && !ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x-R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "trap" && RotNum === 1 && !ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + (y+R);
            var txt3 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          
          if(Shape === "trap" && RotNum === 2 && ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x+R) + "_" + y;
            var txt3 = "" + (x+R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "trap" && RotNum === 2 && ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x+R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "trap" && RotNum === 2 && !ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + (y-R);
            var txt3 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "trap" && RotNum === 2 && !ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            var txt3 = "" + (x-R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          
          
          if(Shape === "rhom" && RotNum === 0 && ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
          }
          if(Shape === "rhom" && RotNum === 0 && ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
          }
          if(Shape === "rhom" && RotNum === 0 && !ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
          }
          if(Shape === "rhom" && RotNum === 0 && !ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
          }
          
          if(Shape === "rhom" && RotNum === 1 && ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt3 = "" + (x-R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "rhom" && RotNum === 1 && ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "rhom" && RotNum === 1 && !ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "rhom" && RotNum === 1 && !ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt3 = "" + (x+R) + "_" + y;
            

            Data[txt].a = 1;
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          
          if(Shape === "rhom" && RotNum === 2 && ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt3 = "" + (x+R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "rhom" && RotNum === 2 && ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt3 = "" + (x+R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          if(Shape === "rhom" && RotNum === 2 && !ixShift && fa === 0){
            var txt = "" + x + "_" + y;
            var txt2 = "" + (x-R) + "_" + (y-R);
            

            Data[txt].a = 1;
            if(Data[txt2]){
              Data[txt2].a = 1;
            }
          }
          if(Shape === "rhom" && RotNum === 2 && !ixShift && fa === 180){
            var txt = "" + x + "_" + y;
            var txt3 = "" + (x-R) + "_" + (y+R);
            

            Data[txt].a = 1;
            if(Data[txt3]){
              Data[txt3].a = 1;
            }
          }
          
          if(Shape === "tri"){
            var txt = "" + x + "_" + y;
            Data[txt].a = 1;
          }
          
        }
      }
    }
    for(var x = 0; x < 916; x += R){
      for(var y = 0; y < 516; y += R){
        var xShift = 0;
        var yShift = 0;
        var fa = 0;
        if(y%(R*2) !== 0){
          xShift += sin(360/3)*R;
          //fill(0);
          if(x > 890){
            continue;
          }
        }
        else{
          if(x < R){
            continue;
          }
          if(x > 900){
            continue;
          }
        }
        if(x%(R*2) !== 0){
          fa = 180;
          yShift += R*0.5;
        }
        xShift += 5/2 - R;
        yShift += R;
        var txt = "" + x + "_" + y;
        var Col = Data[txt];
        //Data[txt].a = 0;
        stroke(Col.r, Col.g, Col.b);
        fill(Col.r, Col.g, Col.b);
        if(Col.a){
          stroke(NewColor.r, NewColor.g, NewColor.b);
          fill(NewColor.r, NewColor.g, NewColor.b);
          if(mouseIsPressed && T < 0 && t < 0 && (Col.r !== NewColor.r || Col.g !== NewColor.g || Col.b !== NewColor.b)){
            Data[txt] = NewColor;
            var newPostKey = firebase.database().ref().child('pixels3').push().key;
            updates['/pixels3/' + txt] = NewColor;
            Updated = true;
            print("update");
          }
        }
        Hex(fa, sin(360/6)*x + xShift + R,y*1.5 + yShift,R);
      }
    }
  }
  if(Updated){
    t = 50;
    firebase.database().ref().update(updates);
    Updated = false;
    Updates = {};
  }
  if(t > 0){
    fill(0);
    text("cooldown Time: " + t,30, 30);
  }
  //Time--;
  //if(Time >= 0){
    //storeItem("Time",Time);
  //}rrrr
  if(keyIsPressed && keyCode === 114 && T < 0){
    RotNum++;
    T = 10;
  }
  if(keyIsPressed && keyCode === 32 && T < 0){
    if(Shape === "hex"){
      Shape = "trap";
    } else if(Shape === "trap"){
      Shape = "rhom";
    } else if(Shape === "rhom"){
      Shape = "tri";
    } else if(Shape === "tri"){
      Shape = "hex";
    }
    T = 10;
  }
  if(RotNum > 2){
    RotNum = 0;
  }
  T--;
  t--;
  }
}