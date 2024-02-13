var file;
var TestShader;
var vertexes = [];
var triangles = [];

var Cr = [];
var Cg = [];
var Cb = [];

var P1x = [];
var P1y = [];
var P1z = [];

var P2x = [];
var P2y = [];
var P2z = [];

var P3x = [];
var P3y = [];
var P3z = [];
var canvas;
var gl;
var test;
var tArray;
function preload(){
  TestShader = loadShader('shader.vert', 'shader.frag');
  file = loadStrings('teapot.txt');
}

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  
  tArray = [0.1, 0.2, 0.3];
  gl = drawingContext;
  test = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, test);
  gl.bufferData(gl.ARRAY_BUFFER, tArray, gl.STATIC_DRAW);
}
var s = true;
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
  if(s){
    for(var i = 0; i < file.length; i++){
      var line = split(file[i], ' ');
      if(line[0] === 'v'){
        vertexes.push([float(line[1]), float(line[2]), float(line[3])]);
      }
      if(line[0] === 'f'){
        triangles.push([int(line[1]-1), int(line[2]-1), int(line[3]-1)]);
      }
    }
    for(var i = 0; i < triangles.length; i++){
      if(triangles[i].length === 3){
        var p1 = vertexes[triangles[i][0]];
        var p2 = vertexes[triangles[i][1]];
        var p3 = vertexes[triangles[i][2]];
        if(p1 && p2 && p3){
          Cr.push(random(0,1));
          Cg.push(random(0,1));
          Cb.push(random(0,1));
          
          P1x.push(p1[0]);
          P1y.push(p1[1]);
          P1z.push(p1[2]);
          
          P2x.push(p2[0]);
          P2y.push(p2[1]);
          P2z.push(p2[2]);
          
          P3x.push(p3[0]);
          P3y.push(p3[1]);
          P3z.push(p3[2]);
        }
      }
    }
    s = false;
  }
  background(220);
  shader(TestShader);
  TestShader.setUniform('mousePos', [float(mouseX/width), float(1-(mouseY/height))]);
  //var tArray = [0.1, 0.2, 0.3];
  //var gl = drawingContext;
  //var test = gl.createBuffer();
  //gl.bindBuffer(gl.ARRAY_BUFFER, test);
  //gl.bufferData(gl.ARRAY_BUFFER, tArray, gl.STATIC_DRAW);
  /*
  {
			nComp = 3;
			type        = gl.FLOAT;
			Norm   = false;
			stride      = 0;
			offset      = 0;
            //print(typeof(TestShader._glProgram))
            //var AttributePos = gl.getAttribLocation( TestShader._glProgram, 'test');

			gl.bindBuffer( gl.ARRAY_BUFFER, test);
			//gl.vertexAttribPointer(gl.getAttribLocation( TestShader._glProgram, 'test'), nComp, type, Norm, stride, offset);
			//gl.enableVertexAttribArray(gl.getAttribLocation( TestShader._glProgram, 'test'));
		}
  */
  var YRot = mouseX/100;
  var XRot = mouseY/100;
  //TestShader.setUniform('numPoints', []);
  TestShader.setUniform('YRot', float(YRot));
  TestShader.setUniform('XRot', float(XRot));
  
  TestShader.setUniform('PLen', int(P1x.length));
  
  TestShader.setUniform('Cr', Cr);
  TestShader.setUniform('Cg', Cg);
  TestShader.setUniform('Cb', Cb);
  
  TestShader.setUniform('P1x', P1x);
  TestShader.setUniform('P1y', P1y);
  TestShader.setUniform('P1z', P1z);
  
  TestShader.setUniform('P2x', P2x);
  TestShader.setUniform('P2y', P2y);
  TestShader.setUniform('P2z', P2z);
  
  TestShader.setUniform('P3x', P3x);
  TestShader.setUniform('P3y', P3y);
  TestShader.setUniform('P3z', P3z);
  
  rect(0,0,width, height);
  }
}