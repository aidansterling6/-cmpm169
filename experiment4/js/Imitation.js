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
precision mediump float;
precision highp int;

uniform vec2 mousePos;
int numPoints = 3;
uniform float XArray[500];
uniform float YArray[500];

varying vec2 vTexCoord;

void main() {
  // now because of the varying vTexCoord, we can access the current texture coordinate
  vec2 uv = vTexCoord;
  float x = uv.x-mousePos.x;
  float y = uv.y-mousePos.y;
  float dist = sqrt((x*x)+(y*y));
  float IDist = 1.0/(1000.0 * dist * dist);
  float LDist = 1.0 - (dist*2.0);
  
  //float x2 = uv.x-0.5;
  //float y2 = uv.y-0.5;
  //float dist2 = sqrt((x2*x2)+(y2*y2));
  //float IDist2 = 1.0/(100.0 * dist2 * dist2);
  //float LDist2 = 1.0 - (dist2*2.0);
  
  float sum = IDist;
  for(int i = 0; i < 500; i++){
    if(i >= numPoints){
      break;
    }
    float x2 = uv.x-XArray[i];
    float y2 = uv.y-YArray[i];
    float dist2 = sqrt((x2*x2)+(y2*y2));
    float IDist2 = 1.0/(1000.0 * dist2 * dist2);
    float LDist2 = 1.0 - (dist2*2.0);
    sum = sum + IDist2;
  }
  float fval = 0.0;
  //if(IDist + IDist2 > 0.7){
  //  fval = 1.0;
  //}
  if(sum > 0.7){
    fval = 1.0;
  }
  
  // and now these coordinates are assigned to the color output of the shader
  if(fval == 1.0){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  else{
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}
`
var TestShader;
function setup() {
  createCanvas(800, 800, WEBGL);
  TestShader = createShader(vert, frag);
}

function draw() {
  background(220);
  shader(TestShader);
  TestShader.setUniform('mousePos', [float(mouseX/width), float(1-(mouseY/height))]);
  //TestShader.setUniform('numPoints', []);
  TestShader.setUniform('XArray', [0, 0.5, 0.6]);
  TestShader.setUniform('YArray', [0.4, 0.2, 0.8]);
  rect(0,0,width, height);
}