#version 300 es

precision highp float;
precision highp int;

const int MaxLen = 14000;

uniform int PLen;

uniform float YRot;
uniform float XRot;
uniform float Scale;

//uniform float Cr[MaxLen];
//uniform float Cg[MaxLen];
//uniform float Cb[MaxLen];

//uniform float P1x[MaxLen];
//uniform float P1y[MaxLen];
//uniform float P1z[MaxLen];

//uniform float P2x[MaxLen];
//uniform float P2y[MaxLen];
//uniform float P2z[MaxLen];

//uniform float P3x[MaxLen];
//uniform float P3y[MaxLen];
//uniform float P3z[MaxLen];

out vec4 fragColor;

uniform sampler2D uSampler;
uniform float TexLen;
uniform int TexLeni;


in vec2 vTexCoord;

vec3 Cross(vec3 A, vec3 B){
  float Cx = A.y*B.z-A.z*B.y;
  float Cy = A.z*B.x-A.x*B.z;
  float Cz = A.x*B.y-A.y*B.x;
  return vec3(Cx, Cy, Cz);
}


vec3 TriNormal(vec3 A, vec3 B, vec3 C){
  //float d = length(cross((B-A),(C-A)));
  //if(d == vec3(0.0,0.0,0.0)){
  //  return vec4(0.0,0.0,0.0,0.0);
  //}
  vec3 n = Cross((B-A),(C-A));
  n = n/length(n);
  return n;
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float TriD(vec3 A, vec3 N){
  return dot(N, A);
}
vec4 VecPlaneCol(vec3 Orgin, vec3 Direction, vec3 PlaneNorm, float PlaneD){
  float nd = dot(PlaneNorm,Direction);
  if(nd == 0.0){
    return vec4(0.0,0.0,0.0,0.0);
  }
  float t = (PlaneD - dot(PlaneNorm, Orgin))/nd;
  vec3 point = Orgin + (t*Direction);
  return vec4(point, 1.0);
}

bool inTri(vec3 Point, vec3 A, vec3 B, vec3 C, vec3 Normal){
  if(dot(Cross((B-A),(Point-A)),Normal) <= 0.0){
    return false;
  }
  if(dot(Cross((C-B),(Point-B)),Normal) <= 0.0){
    return false;
  }
  if(dot(Cross((A-C),(Point-C)),Normal) <= 0.0){
    return false;
  }
  return true;
}
//vec3 p1 = vec3(100.0, 100.0, 10.0);
//vec3 p2 = vec3(400.0, 100.0, 10.0);
//vec3 p3 = vec3(250.0, 450.0, 10.0);

void main() {
  
  vec4 T = texture(uSampler, vTexCoord);
  // now because of the varying vTexCoord, we can access the current texture coordinate
  vec2 uv = vTexCoord;
  vec3 vecOrgin = vec3(uv.x*800.0, uv.y*800.0, 0);
  vec3 vecDirection = vec3(0.0,0.0,1.0);
  bool Collided = false;
  bool fCol = false;
  float MinDist = -1.0;
  vec4 minC;
  for(int i = 0; i <= MaxLen; i++){
    if(i >= TexLeni){
      break;
    }
    float I = float(i);
    if(true || i == 3){
      
    vec4 TP1 = texture(uSampler, vec2((I + 0.5)/TexLen, 0.1)); 
    vec4 TP2 = texture(uSampler, vec2((I + 0.5)/TexLen, 0.5)); 
    vec4 TP3 = texture(uSampler, vec2((I + 0.5)/TexLen, 0.9)); 
      
    vec3 p1v0 = vec3(map(TP1.r, 0.0,1.0,-1.0,1.0)*Scale, map(TP1.g, 0.0,1.0,-1.0,1.0)*Scale, map(TP1.b, 0.0,1.0,-1.0,1.0)*Scale);
    vec3 p2v0 = vec3(map(TP2.r, 0.0,1.0,-1.0,1.0)*Scale, map(TP2.g, 0.0,1.0,-1.0,1.0)*Scale, map(TP2.b, 0.0,1.0,-1.0,1.0)*Scale);
    vec3 p3v0 = vec3(map(TP3.r, 0.0,1.0,-1.0,1.0)*Scale, map(TP3.g, 0.0,1.0,-1.0,1.0)*Scale, map(TP3.b, 0.0,1.0,-1.0,1.0)*Scale);
    
    //vec3 p1v0 = vec3(TP1.r, P1y[i], P1z[i]);
    //vec3 p1v0 = vec3(P1x[i], P1y[i], P1z[i]);
    //vec3 p2v0 = vec3(P2x[i], P2y[i], P2z[i]);
    //vec3 p3v0 = vec3(P3x[i], P3y[i], P3z[i]);
    
      
    vec3 p1v1 = vec3(cos(YRot)*p1v0.x - sin(YRot)*p1v0.z, p1v0.y, cos(YRot)*p1v0.z + sin(YRot)*p1v0.x);
      
    vec3 p2v1 = vec3(cos(YRot)*p2v0.x - sin(YRot)*p2v0.z, p2v0.y, cos(YRot)*p2v0.z + sin(YRot)*p2v0.x);
      
    vec3 p3v1 = vec3(cos(YRot)*p3v0.x - sin(YRot)*p3v0.z, p3v0.y, cos(YRot)*p3v0.z + sin(YRot)*p3v0.x);
      
      
    vec3 p1 = vec3(p1v1.x, cos(XRot)*p1v1.y - sin(XRot)*p1v1.z, cos(XRot)*p1v1.z + sin(XRot)*p1v1.y)*100.0;
    vec3 p2 = vec3(p2v1.x, cos(XRot)*p2v1.y - sin(XRot)*p2v1.z, cos(XRot)*p2v1.z + sin(XRot)*p2v1.y)*100.0;
    vec3 p3 = vec3(p3v1.x, cos(XRot)*p3v1.y - sin(XRot)*p3v1.z, cos(XRot)*p3v1.z + sin(XRot)*p3v1.y)*100.0;
      
    p1.z += 250.0;
    p2.z += 250.0;
    p3.z += 250.0;
    
    p1.x += 400.0;
    p2.x += 400.0;
    p3.x += 400.0;
    
    p1.y += 400.0;
    p2.y += 400.0;
    p3.y += 400.0;
    vec3 PlaneNormal = TriNormal(p1, p2, p3);
    //if(uv.x == 0.0 && uv.y == 0.0){
    //  print("str(PlaneNormal.x)");
    //}
    if(dot(PlaneNormal, vecDirection) < 0.0){
    float d = TriD(p1, PlaneNormal);
    vec4 Intersect = VecPlaneCol(vecOrgin, vecDirection, PlaneNormal, d);
    if(Intersect.a == 1.0){
      Collided = true;
    }
    vec3 IntersectPoint = vec3(Intersect.x, Intersect.y, Intersect.z);
    if(inTri(IntersectPoint, p1, p2, p3, PlaneNormal) == true){
      fCol = true;
      float dx = IntersectPoint.x - vecOrgin.x;
      float dy = IntersectPoint.y - vecOrgin.y;
      float dz = IntersectPoint.z - vecOrgin.z;
      float Dist = sqrt((dx*dx) + (dy*dy) + (dz*dz));
      if((MinDist == -1.0 || Dist < MinDist)){
        MinDist = Dist;
        //minC = vec4((Dist/400.0), (Dist/400.0), (Dist/400.0), 1.0);
        minC = vec4((1.5-Dist/400.0)*((PlaneNormal.x+1.0)/2.0), (1.5-Dist/400.0)*((PlaneNormal.y+1.0)/2.0), (1.5-Dist/400.0)*((PlaneNormal.z+1.0)/2.0), 1.0);
        //minC = vec4(Cr[i]*(Dist/200.0), Cg[i]*(Dist/200.0), Cb[i]*(Dist/200.0), 1.0);
        if(mod(floor(Dist/10.0),2.0) == 0.0){
          //minC = vec4((1.0 - Dist/400.0), (1.0 - Dist/200.0), (1.0 - Dist/200.0), 1.0);
          minC = vec4(1.0-minC.r, 1.0-minC.g, 1.0-minC.b, 1.0);
        }
        //if(mod(floor(Dist/20.0),2.0) == 0.0){
          //minC = vec4((1.0 - Dist/200.0), (1.0 - Dist/400.0), (1.0 - Dist/200.0), 1.0);
        //}
        //minC = vec4(((PlaneNormal.x+1.0)/2.0), (PlaneNormal.y+1.0)/2.0, (PlaneNormal.z+1.0)/2.0, 1.0);
      }
    }
    }
    }
  }
  if(/*Collided && inTri(IntersectPoint, p1, p2, p3, PlaneNormal) == true*/fCol){
  //if(IntersectPoint.x == vecOrgin.x && IntersectPoint.y == vecOrgin.y){
    //gl_FragColor = vec4(Cr[minI], Cg[minI], Cb[minI], 1.0);
    fragColor = minC;
  }/* else if(sqrt(((vecOrgin.x-p1.x)*(vecOrgin.x-p1.x))+((vecOrgin.y-p1.y)*(vecOrgin.y-p1.y))) < 20.0){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else if(sqrt(((vecOrgin.x-p2.x)*(vecOrgin.x-p2.x))+((vecOrgin.y-p2.y)*(vecOrgin.y-p2.y))) < 20.0){
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  } else if(sqrt(((vecOrgin.x-p3.x)*(vecOrgin.x-p3.x))+((vecOrgin.y-p3.y)*(vecOrgin.y-p3.y))) < 20.0){
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
  }*/
  else{
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
  //if(abs(vTexCoord.x - (3.0 + 0.5)/12.0) < 0.001){
  //  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
  //} else{
  //  fragColor = vec4(T.r, T.g, T.b, 1.0);
  //}
}