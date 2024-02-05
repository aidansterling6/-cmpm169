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
    //count += 1.0;
    //if(IDist2 > 1.0){
      //IDist2 = 1.0;
    //}
    //if(LDist2 > 30.0){
    //  LDist2 = 30.0;
    //}
    //ColorSumR += 1.0*LDist;
    //ColorSumG += 0.0*LDist;
    //ColorSumB += 0.0*LDist;
  
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
    final.a = 1.0;
    gl_FragColor = final;
    //gl_FragColor = finalColor;
  }
  else{
    gl_FragColor = texture2D(tex0, 1.0-vTexCoord);
  }
}