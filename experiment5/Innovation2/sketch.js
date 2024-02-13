//scroll to zoom

var file;
var Shader;
var vertexes = [];
var triangles = [];
var Scale = 0.5;

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
var ext;
var n = 200;
var VertTex;

var scrollDelta = 0;
function mouseWheel(event) { 
    scrollDelta = event.delta;
}

function preload(){
  Shader = loadShader("shader.vert", "shader.frag");
  file = loadStrings('rook.txt');
}

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  //Shader = loadShader('shader.vert', 'shader.frag');
  //file = loadStrings('teapot.txt');
  gl = drawingContext;
  ext = gl.getExtension("EXT_color_buffer_float");
  
  var maxNum = 0;
  var minNum = 0;
  for(var i = 0; i < file.length; i++){
      var line = split(file[i], ' ');
      if(line[0] === 'v'){
        var l1 = line[1];
        var l2 = line[2];
        var l3 = line[3];
        
        var ls1 = split(l1, '/');
        var ls2 = split(l2, '/');
        var ls3 = split(l3, '/');
        
        var n1 = float(ls1[0]);
        var n2 = float(ls2[0]);
        var n3 = float(ls3[0]);
        if(n1 < minNum){
          minNum = n1;
        }
        if(n2 < minNum){
          minNum = n2;
        }
        if(n3 < minNum){
          minNum = n3;
        }
        
        if(n1 > maxNum){
          maxNum = n1;
        }
        if(n2 > maxNum){
          maxNum = n2;
        }
        if(n3 > maxNum){
          maxNum = n3;
        }
        vertexes.push([n1, n2, n3]);
      }
      if(line[0] === 'f' && line.length > 3){
        for(var I = 1; I <= line.length - 3; I++){
        
        var l1 = line[1];
        var l2 = line[I + 1];
        var l3 = line[I + 2];
        
        var ls1 = split(l1, '/');
        var ls2 = split(l2, '/');
        var ls3 = split(l3, '/');
        
        triangles.push([int(ls1[0]-1), int(ls2[0]-1), int(ls3[0]-1)]);
      }
      }
    }
  var sumx = 0;
  var sumy = 0;
  var sumz = 0;
  var numt = 0;
  for(var i = 0; i < vertexes.length; i++){
    vertexes[i][0] = map(vertexes[i][0], minNum, maxNum, -1, 1);
    vertexes[i][1] = map(vertexes[i][1], minNum, maxNum, -1, 1);
    vertexes[i][2] = map(vertexes[i][2], minNum, maxNum, -1, 1);
    sumx += vertexes[i][0];
    sumy += vertexes[i][1];
    sumz += vertexes[i][2];
    numt += 1;
  }
  for(var i = 0; i < vertexes.length; i++){
    vertexes[i][0] = vertexes[i][0] - sumx/numt;
    vertexes[i][1] = vertexes[i][1] - sumy/numt;
    vertexes[i][2] = vertexes[i][2] - sumz/numt;
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
          
          //(i === 0){
          //print(p3[0] + ", " + p3[1] + ", " + p3[2]);
          //
          
          //rray.push(map(p1[0], -1,1,0,1));
          //rray.push(map(p1[1], -1,1,0,1));
          //rray.push(map(p1[2], -1,1,0,1));
          
          //rray.push(map(p2[0], -1,1,0,1));
          //rray.push(map(p2[1], -1,1,0,1));
          //rray.push(map(p2[2], -1,1,0,1));
          
          //rray.push(map(p3[0], -1,1,0,1));
          //rray.push(map(p3[1], -1,1,0,1));
          //rray.push(map(p3[2], -1,1,0,1));
          
          
          
        }
      }
    }
  var vArray = new Array(triangles.length * 9);
  for(var i = 0; i < triangles.length; i++){
      if(triangles[i].length === 3){
        var p1 = vertexes[triangles[i][0]];
        var p2 = vertexes[triangles[i][1]];
        var p3 = vertexes[triangles[i][2]];
        if(p1 && p2 && p3){
          vArray[i*3 + 0] = map(p1[0], -1,1,0,1);
          vArray[i*3 + 1] = map(p1[1], -1,1,0,1);
          vArray[i*3 + 2] = map(p1[2], -1,1,0,1);
          
          vArray[i*3 + triangles.length * 3 + 0] = map(p2[0], -1,1,0,1);
          vArray[i*3 + triangles.length * 3 + 1] = map(p2[1], -1,1,0,1);
          vArray[i*3 + triangles.length * 3 + 2] = map(p2[2], -1,1,0,1);
          
          vArray[i*3 + triangles.length * 6 + 0] = map(p3[0], -1,1,0,1);
          vArray[i*3 + triangles.length * 6 + 1] = map(p3[1], -1,1,0,1);
          vArray[i*3 + triangles.length * 6 + 2] = map(p3[2], -1,1,0,1);
          
          //vArray.push(map(p1[0], -1,1,0,1));
          //vArray.push(map(p1[1], -1,1,0,1));
          //vArray.push(map(p1[2], -1,1,0,1));
          
          //vArray.push(map(p2[0], -1,1,0,1));
          //vArray.push(map(p2[1], -1,1,0,1));
          //vArray.push(map(p2[2], -1,1,0,1));
          
          //vArray.push(map(p3[0], -1,1,0,1));
          //vArray.push(map(p3[1], -1,1,0,1));
          //vArray.push(map(p3[2], -1,1,0,1));
        }
      }
  }
  //for(var i = 0; i < P1x.length; i++){
    //print("(" + map(P1x[i], -1,1,0,1) + "," + map(P1y[i], -1,1,0,1) + "," + map(P1z[i], -1,1,0,1) + ")" + "(" + map(P2x[i], -1,1,0,1) + "," + map(P2y[i], -1,1,0,1) + "," + map(P2z[i], -1,1,0,1) + ")" + "(" + map(P3x[i], -1,1,0,1) + "," + map(P3y[i], -1,1,0,1) + "," + map(P3z[i], -1,1,0,1) + ")");
  //}
  
  n = vArray.length/9;
  print(n);
  //for(var i = 0; i < n*3; i++){
  //  vArray.push(Math.random(0,255));
  //  vArray.push(Math.random(0,255));
  //  vArray.push(Math.random(0,255));
  //}
  Vertices = new Float32Array(vArray);
  
  const Level = 0;
  const InternalFormat = gl.RGB32F;
  const Width = n;
  const Height = 3;
  const Slot = 0;
  const Border = 0;
  const SrcFormat = gl.RGB;
  const SrcType = gl.FLOAT;
  const Pixel = Vertices;
  
  VertTex = new Texture.T2D(Level, InternalFormat, Width, Height, Slot, Border, SrcFormat, SrcType, Pixel, gl);
  VertTex.paramI(gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  VertTex.paramI(gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  VertTex.paramI(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  VertTex.paramI(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  

}
function draw() {
  background(220);
  shader(Shader);
  VertTex.bind();
  
  Shader.setUniform('mousePos', [float(mouseX/width), float(1-(mouseY/height))]);
  
  var YRot = mouseX/100;
  var XRot = mouseY/100;
  //Shader.setUniform('numPoints', []);
  Shader.setUniform('YRot', float(YRot));
  Shader.setUniform('XRot', float(XRot));
  Shader.setUniform('Scale', float(Scale));
  
  Shader.setUniform('PLen', int(P1x.length));
  
  //Shader.setUniform('Cr', Cr);
  //Shader.setUniform('Cg', Cg);
  //Shader.setUniform('Cb', Cb);
  
  //Shader.setUniform('P1x', P1x);
  //Shader.setUniform('P1y', P1y);
  //Shader.setUniform('P1z', P1z);
  
  //Shader.setUniform('P2x', P2x);
  //Shader.setUniform('P2y', P2y);
  //Shader.setUniform('P2z', P2z);
  
  //Shader.setUniform('P3x', P3x);
  //Shader.setUniform('P3y', P3y);
  //Shader.setUniform('P3z', P3z);
  
  VertTex.setUniform(Shader._glProgram, "uSampler");
  Shader.setUniform('TexLen', n);
  Shader.setUniform('TexLeni', n);
  
  if (Shader.samplers[0].texture != undefined) {
    Shader.samplers[0].texture.bindTexture = () => null;
    Shader.samplers[0].texture.update = () => null;
    Shader.samplers[0].location = drawingContext.getUniformLocation(Shader._glProgram, "uSampler");
  }
  
  rect(-width/2,-height/2,width, height);
  resetShader();
  
  if(scrollDelta > 0){
    Scale *= 0.9;
  }
  if(scrollDelta < 0){
    Scale *= 1.1;
  }
  scrollDelta = 0;
}