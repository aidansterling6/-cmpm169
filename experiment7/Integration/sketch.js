var inHex = function(x, y, r, Cx, Cy){
  for(var a = 0; a <= 6; a++){
    var X = x + sin(a*(360/6))*r;
    var Y = y + cos(a*(360/6))*r;
    var X2 = x + sin((a + 1)*(360/6))*r;
    var Y2 = y + cos((a + 1)*(360/6))*r;
    var vx = Y2 - Y;
    var vy = -(X2 - X);
    var Dot = vx*(Cx-X) + vy*(Cy-Y);
    //line(Cx, Cy, X, Y);
    if(Dot <= 0){
      return false;
    }
  }
  return true;
}
var Hex = function(x, y, r){
  beginShape();
  for(var a = 0; a <= 6; a++){
    var X = x + sin(a*(360/6))*r;
    var Y = y + cos(a*(360/6))*r;
    var X2 = x + sin((a + 1)*(360/6))*r;
    var Y2 = y + cos((a + 1)*(360/6))*r;
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
  var ref = database.ref('pixels2');
  ref.on('value', gotData, errData);
  
  var Tex1 = createElement('p', 'Red:');
  var Tex2 = createElement('p', 'Green:');
  var Tex3 = createElement('p', 'Blue:');
  var Tex4 = createElement('p', 'Color:');
  
  var Tex5 = createElement('p', 'Enter RGB color and click to draw. Everyone shares the same canvas.');
  
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
  var ref = database.ref('pixels2');
  ref.set(val);
}


//var Time = 0;

var t = 0;
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
    for(var x = 0; x < 871; x += R*2){
      for(var y = 0; y < 1080; y += R*2){
        var Shift = 0;
        if(y%(R*4) !== 0){
          Shift += sin(360/6)*R;
        }
        Shift += 5/2;
        var txt = "" + x + "_" + y;
        var Col = Data[txt];
        if(inHex(sin(360/6)*x + Shift + R,y - 2*y*(1-sin(360/6)) + R,R, mouseX, mouseY)/*mouseX > x && mouseX <= x + 10 && mouseY > y && mouseY <= y + 10*/){
          stroke(0, 0, 0, 20);
          fill(NewColor.r, NewColor.g, NewColor.b);
          //rect(x, y, 9, 9);
          Hex(sin(360/6)*x + Shift + R,y - 2*y*(1-sin(360/6)) + R,R);
          
          
          
          if(mouseIsPressed && t < 0 && (Col.r !== NewColor.r || Col.g !== NewColor.g || Col.b !== NewColor.b)){
            Data[txt] = NewColor;
            var newPostKey = firebase.database().ref().child('pixels2').push().key;
            var updates = {};
            updates['/pixels2/' + txt] = NewColor;
            firebase.database().ref().update(updates)
            t = 50;
            print("update");
          }
        }
        else{
          //noStroke();
          stroke(Col.r, Col.g, Col.b);
          fill(Col.r, Col.g, Col.b);
          //rect(x, y, 10, 10);
          Hex(sin(360/6)*x + Shift + R,y - 2*y*(1-sin(360/6)) + R,R);
        }
      }
    }
  }
  if(t > 0){
    fill(0);
    text("cooldown Time: " + t,30, 30);
  }
  //Time--;
  //if(Time >= 0){
    //storeItem("Time",Time);
  //}
  t--;
  }
}