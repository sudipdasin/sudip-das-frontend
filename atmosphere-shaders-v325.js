/* WebStudio Atmosphere 3.25 — interactive, theme-aware, sitewide: locally authored WebGL2 shaders.
   Decorative analytic ray/sphere intersections, direct light and occlusion shadows;
   NOT a full ray-traced webpage, BVH engine or hardware RTX pipeline. No assets/network. */
(() => {
  'use strict';
  if (!window.PORTFOLIO_PREVIEW_MODE) return;
  const vertex = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_position;
void main(){gl_Position=vec4(a_position,0.0,1.0);}
`;
  const fragment = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform int u_theme;
uniform float u_intensity;
uniform float u_section;
uniform vec2 u_pointer;
uniform float u_scroll;
uniform float u_seed;
uniform float u_pulse;
out vec4 fragColor;
#define PI 3.14159265
float hash(vec2 p) {
  p=fract(p*vec2(123.34,456.21));
  p+=dot(p,p+45.32);
  return fract(p.x*p.y);
}
float noise(vec2 p) {
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.0,a=.5;
  for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.03+1.37;a*=.5;}
  return v;
}
float sphereHit(vec3 ro,vec3 rd,vec3 c,float radius){
  vec3 oc=ro-c;
  float b=dot(oc,rd),h=b*b-dot(oc,oc)+radius*radius;
  if(h<0.0)return -1.0;
  float t=-b-sqrt(h);
  return t>0.002?t:-1.0;
}
float ring(vec2 p,float r,float w){return 1.0-smoothstep(w,w+.007,abs(length(p)-r));}
float line(float d,float w){return 1.0-smoothstep(w,w+.003,abs(d));}
vec3 tracedLight(vec2 uv,float time,vec3 tint){
  vec3 ro=vec3(0.0,0.0,3.3),rd=normalize(vec3(uv,-2.0));
  vec3 center=vec3(.62+.13*sin(time*.25),.0,-.55);
  float t=sphereHit(ro,rd,center,.58);
  if(t<0.0)return vec3(0.0);
  vec3 p=ro+rd*t,n=normalize(p-center);
  vec3 lightPos=vec3(-1.6+.5*sin(time*.13),1.3,2.0);
  vec3 ld=normalize(lightPos-p);
  float diffuse=max(dot(n,ld),0.0);
  float occlusion=sphereHit(p+n*.014,ld,vec3(.15,-.34,.46),.19);
  float shadow=occlusion>0.0?.23:1.0;
  float spec=pow(max(dot(reflect(-ld,n),-rd),0.0),26.0);
  float fresnel=pow(1.0-max(dot(n,-rd),0.0),3.0);
  return tint*(.08+.7*diffuse*shadow)+tint*spec*.45+vec3(.8,.92,1.)*fresnel*.32;
}
void main(){
  vec2 res=max(u_resolution,vec2(1.0));
  vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;
  float time=u_time;
  float section=clamp(u_section,0.0,7.0);
  // Restrained pointer parallax, section transition and daily visual variation.
  float progress=clamp(u_scroll,0.0,1.0);
  float variation=fract(u_seed);
  vec2 pointer=vec2((clamp(u_pointer.x,0.0,1.0)-.5)*res.x/res.y,
                    .5-clamp(u_pointer.y,0.0,1.0));
  vec2 p=uv+vec2(.13*sin(section*1.37+variation*.42),.095*cos(section*.93+progress))
           +pointer*vec2(.035,.028);
  float asp=res.x/res.y;
  vec3 color=vec3(0.0);
  float opacity=.0;
  float grain=(hash(gl_FragCoord.xy+floor(time*5.0))-0.5);
  if(u_theme==0){ /* Neon Studio: perspective photon lanes and soft glass */
    vec2 grid=vec2(uv.x*.8,uv.y*.95+time*.02);
    float streak=pow(max(0.0,sin((grid.x+grid.y)*23.0)),18.0);
    float lane=line(uv.x+.19*sin(uv.y*2.0+time*.24),.005);
    float glow=exp(-6.0*length(uv-vec2(.49,.21)));
    float rays=pow(max(0.0,sin(atan(uv.y,uv.x)*8.0+time*.18)),24.0);
    color=vec3(.03,.46,.62)*(streak*.31+glow*.75+lane*.4)
          +vec3(.52,.14,.95)*rays*.15;
    color+=tracedLight(uv,time,vec3(.02,.56,.81))*.42;
    opacity=.22+.24*(glow+lane);
  }else if(u_theme==1){ /* Orbit: polar orbital filaments and lit satellite */
    float angle=atan(p.y,p.x),radius=length(p-vec2(.13,.0));
    float arcs=ring((p-vec2(.14,.03))*vec2(1.0,1.12),.40,.003)
             +ring((p-vec2(.14,.03))*vec2(1.14,.9),.53,.002);
    float beams=pow(max(0.0,sin(angle*12.0+time*.14)),34.0);
    float lights=exp(-12.0*length(p-vec2(.33*sin(time*.18),.23*cos(time*.18))));
    color=vec3(.02,.43,.47)*(arcs*.84+beams*.11)
       +vec3(.17,.8,.7)*lights*.6
       +tracedLight(uv,time,vec3(.05,.58,.62))*.55;
    opacity=.27+min(.24,arcs*.22+lights*.13);
  }else if(u_theme==2){ /* Editorial: glancing sun through textured paper */
    vec2 sunlight=normalize(vec2(.8,.4));
    float rays=max(0.0,dot(normalize(p+vec2(.01,.05)),sunlight));
    float diagonal=exp(-pow((p.y-.45*p.x-.14)*3.0,2.0));
    float paper=fbm(p*7.5)*.08+grain*.08;
    color=vec3(.40,.27,.15)*(diagonal*.34+paper)
      +vec3(.60,.44,.25)*pow(rays,5.0)*.07;
    opacity=.13+diagonal*.08;
  }else if(u_theme==3){ /* Terminal: fine phosphor scan / code lattice */
    vec2 g=p*vec2(36.0,22.0);
    float scan=pow(max(0.0,sin((p.y+time*.025)*260.0)),15.0);
    float matrix=step(.987,hash(floor(g+vec2(0.,-floor(time*.24)))));
    float bars=line(fract(g.x)*2.0-1.0,.021)*.18+
               line(fract(g.y)*2.0-1.0,.025)*.07;
    float sweep=exp(-12.0*abs(p.y-.24*sin(time*.27)));
    color=vec3(.025,.45,.20)*(scan*.13+matrix*.45+bars*.28+sweep*.20);
    opacity=.17+sweep*.1;
  }else if(u_theme==4){ /* Arctic Radiance: luminous folded curtains with emerald and violet scattering */
    float wave=fbm(vec2(p.x*2.5+time*.012,1.7));
    float curve=.19+.10*sin(p.x*5.2+time*.095)+.06*sin(p.x*11.0-time*.055)+wave*.07;
    float d=p.y-curve;
    float folds=.28+.72*pow(.5+.5*sin(p.x*52.0+wave*9.0+time*.10),2.0);
    float curtain=exp(-abs(d)*10.5)*folds*smoothstep(-.21,.025,d);
    float edge=exp(-abs(d)*45.0);
    float second=exp(-abs(d-.105-.035*sin(p.x*7.0-time*.07))*17.0);
    float violet=exp(-abs(d-.12-.035*sin(p.x*6.0+time*.06))*10.0)*(.35+.65*wave);
    float scatter=exp(-abs(d+.055)*5.2)*(.45+.55*wave);
    float sun=exp(-7.0*length(p-vec2(.36,.13)));
    vec2 cell=(uv+vec2(.7,.5))*vec2(105.,78.);
    vec2 cellId=floor(cell);
    float seed=hash(cellId);
    vec2 center=vec2(.25+.5*hash(cellId+7.0),.25+.5*hash(cellId+13.0));
    vec2 delta=abs(fract(cell)-center);
    float star=step(.982,seed)*exp(-length(delta)*24.0);
    float glint=step(.996,seed)*(exp(-delta.x*95.0-delta.y*13.0)+exp(-delta.y*95.0-delta.x*13.0))*.25;
    star=(star+glint)*(.72+.28*sin(time*.52+seed*73.0));
    float sky=smoothstep(-.13,.25,uv.y);
    float haze=exp(-abs(p.y+.30)*8.0);
    color=vec3(.33,.92,.61)*(curtain*.68+edge*.20)
      +vec3(.24,.80,.83)*second*.24
      +vec3(.63,.47,.91)*violet*.29
      +vec3(.30,.62,.49)*scatter*.14
      +vec3(.94,.85,.55)*sun*.19
      +vec3(.84,.96,.87)*star*sky*.83
      +vec3(.25,.39,.39)*haze*.12;
    opacity=.065+min(.36,curtain*.21+edge*.13+second*.07+violet*.055+star*.25+sun*.045);
  }else{ /* Cosmic: gravitational lens simulation, stars and nebula */
    float dist=length(p-vec2(.16,.02));
    vec2 warped=p+(p-vec2(.16,.02))*(.06/(dist*dist+.13));
    float cloud=fbm(warped*4.1+vec2(time*.01,-time*.005));
    float halo=exp(-8.0*abs(dist-.26));
    float stars=step(.9965,hash(floor(warped*vec2(420.,300.))));
    float dust=pow(max(0.0,cloud-.48)*2.5,2.0);
    color=vec3(.37,.19,.72)*dust*.57
       +vec3(.24,.35,.92)*halo*.48
       +vec3(.65,.58,.95)*stars*.53
       +tracedLight(uv,time,vec3(.45,.18,.84))*.4;
    opacity=.23+halo*.11+dust*.10;
  }
  // Delicate visitor-driven caustics. Not a content overlay, flash or distraction.
  float pointerDistance=length(uv-pointer);
  float interaction=exp(-8.0*pointerDistance)*(.1+.16*sin(progress*PI));
  float ripple=exp(-12.0*abs(pointerDistance-.18-.09*fract(u_seed)))*clamp(u_pulse,0.0,1.0);
  vec3 response=vec3(.10,.45,.49);
  if(u_theme==1)response=vec3(.09,.61,.43);
  else if(u_theme==2)response=vec3(.44,.28,.12);
  else if(u_theme==3)response=vec3(.03,.52,.22);
  else if(u_theme==4)response=vec3(.28,.53,.32);
  else if(u_theme==5)response=vec3(.38,.23,.70);
  color+=response*(interaction+ripple*.12);
  // Subtle daily shift adds fresh atmosphere without tracking or gamification.
  color*=.94+.06*sin(progress*PI+variation*1.73);
  // Section-specific highlights preserve each theme's identity rather than replacing it.
  float localGlow=exp(-9.0*length(p-vec2(.31*sin(section*.69),.16*cos(section*.53))));
  float regionStrength=.76+.17*sin(section*1.07+.45);
  if(u_theme==2)color+=vec3(.22,.15,.09)*localGlow*.05;
  else if(u_theme==3)color+=vec3(.03,.29,.13)*localGlow*.1;
  else if(u_theme==4)color+=vec3(.20,.33,.25)*localGlow*.14;
  else if(u_theme==5)color+=vec3(.34,.15,.50)*localGlow*.13;
  else color+=vec3(.04,.32,.31)*localGlow*.13;
  color=clamp(color*regionStrength,0.0,1.0);
  fragColor=vec4(color,clamp(opacity*u_intensity,0.0,.62));
}
`;
  window.__wsAtmosphereShaders325=Object.freeze({vertex,fragment});
})();
