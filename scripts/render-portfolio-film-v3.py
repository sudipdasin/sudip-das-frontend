#!/usr/bin/env python3
"""Extend approved 44s portfolio film to a 60s cinematic introduction.

All additional art, UI concept imagery and sound synthesis are original;
no 3rd-party sample library, image scraper or model inference is required.
Never presents conceptual UI drawings as screenshots of working applications.
Usage:
  python scripts/render-portfolio-film-v3.py --base media/...mp4 --out media/...mp4 --teaser media/...webm
"""
from __future__ import annotations
import argparse, math, os, random, subprocess, tempfile, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W,H,FPS=1280,720,24
TEAL=(94,242,210); BLUE=(116,185,250); PURPLE=(187,138,250)
GOLD=(248,187,130); INK=(238,250,250); MUTED=(182,212,218)
FONTB='/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf'
FONT='/usr/share/fonts/opentype/inter/Inter-Regular.otf'
MONO='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
if not Path(FONTB).exists(): FONTB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
if not Path(FONT).exists():FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
if not Path(MONO).exists():MONO=FONT
F={n:ImageFont.truetype(FONT,n) for n in (14,16,18,20,22,24,26,30,35)}
B={n:ImageFont.truetype(FONTB,n) for n in (17,19,22,24,27,30,38,44,48,55,59,63,68)}
M={n:ImageFont.truetype(MONO,n) for n in (13,14,15,16,18)}

SCENES=[
  ('01 / GLOBAL SERVICE','TECHNOLOGY','AT HUMAN SCALE','1,000+ CRM users supported across regions',TEAL),
  ('02 / BUSINESS SYSTEMS','FROM COMPLEXITY','TO CLARITY','A custom MIS suite served 200+ users',BLUE),
  ('03 / OPEN SOURCE','THE DESKTOP','REIMAGINED','LinWin · Tux Steward · iVivid',PURPLE),
  ('04 / CREATIVE PRACTICE','IDEAS INTO','MOTION','Animation Studio · independent experiments',GOLD),
]
# Insert precisely at real boundaries in the source film. Total = 44 + 4*4 = 60s.
SPLITS=[(0,10),(10,20),(20,30.4),(30.4,39.8),(39.8,44)]

def smooth(x):
 x=max(0.,min(1.,x));return x*x*(3-2*x)
def rgba(c,a=255):return (int(c[0]),int(c[1]),int(c[2]),int(a))
def light(c,f=.34):return tuple(min(255,int(v+(255-v)*f)) for v in c)
def tt(d,xy,t,font,color):d.text((int(xy[0]),int(xy[1])),t,font=font,fill=color,stroke_width=0)
def rr(d,box,r,fill,outline=None,width=1):d.rounded_rectangle(tuple(map(int,box)),radius=int(r),fill=fill,outline=outline,width=width)
def lin(d,pts,c,w=2):d.line(pts,fill=c,width=w,joint='curve')

BACKS=[]
for i in range(4):
 top=np.array([(6,23,40),(8,19,43),(14,14,36),(23,18,38)][i],dtype=np.float32)
 bottom=np.array([(16,54,72),(18,41,66),(32,32,73),(54,35,54)][i],dtype=np.float32)
 v=np.linspace(0,1,H,dtype=np.float32)[:,None,None]
 cols=(top[None,None,:]*(1-v)+bottom[None,None,:]*v).clip(0,255).astype('uint8')
 arr=np.broadcast_to(cols,(H,W,3)).copy()
 # Cooled left vignette, light bleed toward right side
 arr[:,:,0]=(arr[:,:,0]*np.linspace(.86,1.12,W)[None,:]).clip(0,255)
 arr[:,:,1]=(arr[:,:,1]*np.linspace(.91,1.09,W)[None,:]).clip(0,255)
 BACKS.append(Image.fromarray(arr,'RGB').convert('RGBA'))

def base_frame(i,frame):
 t=frame/FPS
 im=BACKS[i].copy();d=ImageDraw.Draw(im,'RGBA')
 # restrained grid + floating dust and lens glints
 for x in range(0,W,60):lin(d,[(x,0),(x,H)],(140,203,217,13),1)
 for y in range(0,H,60):lin(d,[(0,y),(W,y)],(140,203,217,13),1)
 for n in range(62):
  a=(n*413+31)%W;b=(n*223+89)%H
  x=(a+math.sin(t*.53+n)*14)%W;y=(b+t*(3+n%5))%H
  radius=1+(n%4==0)
  d.ellipse((x-radius,y-radius,x+radius,y+radius),fill=rgba([TEAL,BLUE,PURPLE,GOLD][n%4],22+n%7*5))
 # cinematic quadrant gradient glow behind main diagram
 glow=Image.new('RGBA',(W,H));gd=ImageDraw.Draw(glow,'RGBA')
 cx,cy=920+math.sin(t*1.1)*28,345+math.cos(t*.8)*22
 for radius in range(310,50,-12):
  al=int(24*(1-radius/350))
  gd.ellipse((cx-radius,cy-radius,cx+radius,cy+radius),fill=rgba(SCENES[i][-1],al))
 im=Image.alpha_composite(im,glow.filter(ImageFilter.GaussianBlur(27)))
 d=ImageDraw.Draw(im,'RGBA')
 # cinematic metadata, new scoped scene number and progress
 tt(d,(70,50),'SUDIP DAS    /    PROFESSIONAL INTRODUCTION',M[14],rgba(MUTED))
 d.rectangle((70,87,245,90),fill=rgba(SCENES[i][-1],205))
 lin(d,[(0,5),(int(W*t/4),5)],rgba(SCENES[i][-1],220),5)
 tt(d,(70,147),SCENES[i][0],M[18],rgba(GOLD))
 ttl1,ttl2=SCENES[i][1],SCENES[i][2]
 reveal=smooth((t-.2)/.52)
 dx=int((1-reveal)*(-35))
 tt(d,(70+dx,222),ttl1,B[59],rgba(INK,int(255*reveal)))
 tt(d,(70+dx,296),ttl2,B[55],rgba(SCENES[i][-1],int(255*reveal)))
 rr(d,(71,399,137,403),3,rgba(GOLD,int(210*reveal)))
 tt(d,(70,421),SCENES[i][3],F[22],rgba(MUTED,int(245*reveal)))
 rr(d,(70,550,307,580),9,(12,47,57,193),(101,188,191,77),1)
 tt(d,(84,558),'VISUAL CONCEPT / PUBLIC WORK',M[13],rgba((171,223,230)))
 for n in range(13):
  xx=70+n*34;rr(d,(xx,615,xx+(27 if n==i+2 else 19),619),2,rgba(SCENES[i][-1] if n==i+2 else (97,138,151),225 if n==i+2 else 88))
 tt(d,(70,657),'ORIGINAL VISUALS  /  ORIGINAL SOUND  /  720P',M[14],rgba(MUTED,190))
 tt(d,(1195,657),f'{i+1:02d} / 04',M[14],rgba(MUTED,185))
 return im,d

def scene_global(d,t,color):
 cx,cy=931,321
 for r in (99,171,224):
  d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=rgba(color,42+r//13),width=2)
 for lat in [-.7,-.4,0,.4,.7]:
  ry=150*math.sqrt(1-lat**2);yy=cy+lat*169
  d.arc((cx-160,yy-ry*.17,cx+160,yy+ry*.17),0,180,fill=rgba(color,60),width=2)
 for angle in (0,45,90,135):
  # elliptical meridian projection
  r=165
  xx=abs(r*math.cos(math.radians(angle)));d.ellipse((cx-xx,cy-r,cx+xx,cy+r),outline=rgba(color,45),width=2)
 rng=np.random.default_rng(221)
 dots=[(cx+math.cos(n*2.399)*int(62+(n%8)*17),cy+math.sin(n*2.399)*int(38+(n%10)*12)) for n in range(27)]
 count=int(smooth(t/2.5)*len(dots))
 for n,(x,y) in enumerate(dots[:count]):
  r=2.5+(n%5==0)*2.5;d.ellipse((x-r,y-r,x+r,y+r),fill=rgba(light(color,n%3*.12),190))
  if n>=1 and n%3==0:
   j=(n*7+1)%n;xx,yy=dots[j]
   lin(d,[(x,y),(xx,yy)],rgba(color,55),1)
 stat='1,000+'
 rr(d,(830,453,1114,522),15,(8,27,42,230),(110,225,218,142),2)
 tt(d,(854,458),stat,B[38],rgba(INK))
 tt(d,(1027,481),'CRM USERS',M[13],rgba(MUTED))

def scene_systems(d,t,color):
 # Tilted but legible dashboard panes; illustrative, not real customer data
 x,y=765,153
 rr(d,(x,y,1187,523),19,(12,34,55,230),(138,196,238,110),2)
 rr(d,(x+13,y+12,1173,y+48),8,(26,62,82,220),None)
 for n,c in enumerate([(249,120,111),(253,190,112),(122,228,191)]):
  d.ellipse((x+27+n*19,y+25,x+34+n*19,y+32),fill=rgba(c,185))
 tt(d,(x+119,y+18),'OPERATIONS / MIS OVERVIEW',M[13],rgba((186,224,241)))
 rr(d,(x+22,y+71,x+191,y+185),11,(25,62,77,210),(111,184,215,85))
 tt(d,(x+36,y+84),'200+',B[44],rgba(INK))
 tt(d,(x+36,y+145),'USERS SERVED',M[13],rgba(MUTED))
 rr(d,(x+210,y+71,x+399,y+185),11,(25,62,77,210),(111,184,215,85))
 tt(d,(x+225,y+89),'SQL',B[38],rgba(color))
 tt(d,(x+225,y+145),'SYSTEMS',M[13],rgba(MUTED))
 for k in range(5):
  yy=y+224+k*24
  tt(d,(x+24,yy),['CRM','SERVICE','REPORTS','SQL','WORKFLOWS'][k],M[13],rgba(MUTED))
  rr(d,(x+162,yy+1,1137,yy+9),4,(55,91,111,100))
  width=int((145+170*math.sin(k*.9+1)**2)*smooth((t-.35-k*.12)/1.8))
  rr(d,(x+162,yy+1,x+162+width,yy+9),4,rgba(color,165))
 # predictive wireframe cursor / drawn chart glow
 for k in range(14):
  xx=802+k*25; yy=438+math.sin(k*.6+t*2)*17
  if k:lin(d,[(802+(k-1)*25,438+math.sin((k-1)*.6+t*2)*17),(xx,yy)],rgba((126,233,227),155),2)

def scene_desktop(d,t,color):
 # Three public project directions in conceptual mini-windows, no false UI claims.
 frames=[(770,148,1144,353,'LinWin',TEAL),
         (817,211,1195,439,'Tux Steward',BLUE),
         (745,318,1094,531,'iVivid',PURPLE)]
 for j,(x,y,x2,y2,title,col) in enumerate(frames):
  enter=smooth((t-j*.38)/.7);off=int((1-enter)*110)
  yy=y+off
  rr(d,(x,yy,x2,y2+off),13,(12,30,48,241),rgba(col,140),2)
  rr(d,(x+9,yy+8,x2-9,yy+36),6,(40,64,83,230))
  for n in range(3):d.ellipse((x+18+n*14,yy+19,x+24+n*14,yy+25),fill=rgba([(238,126,121),(243,188,122),(124,226,188)][n]))
  tt(d,(x+80,yy+10),title,B[17],rgba(INK))
  for k in range(4):
   oy=yy+55+k*23
   rr(d,(x+23,oy,x+138+((j+k)%3)*23,oy+8),3,rgba(col,64+k*18))
  rr(d,(x2-100,yy+56,x2-19,yy+132),13,rgba(col,41),(139,207,238,68))
  d.ellipse((x2-78,yy+75,x2-44,yy+109),outline=rgba(col,180),width=3)
  rr(d,(x+23,yy+148,x+95,yy+163),7,rgba(col,110))

def scene_creative(d,t,color):
 cx,cy=973,320
 # Abstract animated 3-D animation rings and original creative frames
 for n,r in enumerate([180,131,84]):
  phase=t*.4+n*1.2
  rect=(cx-r,cy-r*.72,cx+r,cy+r*.72)
  d.arc(rect,int(phase*43)%360,int(phase*43+300)%360,fill=rgba([GOLD,PURPLE,TEAL][n],164),width=3)
 for k in range(14):
  a=k*2*math.pi/14+t*.36;r=100+45*math.sin(t*.8+k*.4)
  x=cx+r*math.cos(a);y=cy+r*.65*math.sin(a)
  d.ellipse((x-4,y-4,x+4,y+4),fill=rgba([GOLD,TEAL,PURPLE][k%3],190))
 rr(d,(828,250,1119,415),18,(17,36,56,210),(235,186,130,120),2)
 # layered theatrical curtains, keyframes and filmstrip
 for n in range(6):
  yy=283+n*19
  amplitude=32+11*n
  coords=[]
  for k in range(56):
   xx=853+k*4
   amp=math.sin(k*.27+t*3+n*.8)*amplitude*.26
   coords.append((xx,yy+amp))
  lin(d,coords,rgba([GOLD,PURPLE,TEAL][n%3],160),2)
 for k in range(7):
  xx=805+k*45
  rr(d,(xx,485,xx+34,512),5,(24,44,57,190),(152,189,206,66))
  rr(d,(xx+8,492,xx+25,505),3,rgba([GOLD,TEAL,BLUE][k%3],80+int(100*math.sin(t*2+k)**2)))

ART=[scene_global,scene_systems,scene_desktop,scene_creative]
def render_extra_clip(i,out,seconds=4):
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','-','-an','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(out)]
 ff=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 try:
  for n in range(int(seconds*FPS)):
   t=n/FPS;im,d=base_frame(i,n)
   ART[i](d,t,SCENES[i][-1])
   # Soft fade at beginning/end to blend with neighbouring chapters.
   alpha=min(1.,smooth(t/.21),smooth((seconds-t)/.22))
   if alpha<.99:
    cover=Image.new('RGBA',(W,H),(4,11,23,int(255*(1-alpha)*.72)))
    im=Image.alpha_composite(im,cover)
   ff.stdin.write(im.convert('RGB').tobytes())
 finally:
  ff.stdin.close()
 if ff.wait()!=0:raise RuntimeError('FFmpeg failed rendering a scene')
 print('SCENE',i+1,Path(out).stat().st_size,'bytes',flush=True)

def soundtrack(base,out):
 # Existing music is original; extend by four new musical bridges, mix a
 # continuous, newly generated multi-layer harmonic bed over the full film.
 sr=44100;N=60*sr
 raw=subprocess.check_output(['ffmpeg','-hide_banner','-loglevel','error','-i',str(base),'-vn','-ar',str(sr),'-ac','2','-f','f32le','pipe:1'])
 old=np.frombuffer(raw,dtype='<f4').reshape(-1,2)
 mix=np.zeros((N,2),dtype=np.float32)
 borders=[0.,10.,14.,24.,28.,38.4,42.4,51.8,55.8,60.]
 src=[(0,10),(None,None),(10,20),(None,None),(20,30.4),(None,None),(30.4,39.8),(None,None),(39.8,44)]
 def putmono(arr,pos,gain=.1,pan=0):
  p=int(pos*sr);n=min(N-p,len(arr));
  if n<=0 or p<0:return
  y=np.asarray(arr[:n],dtype=np.float32)*gain
  mix[p:p+n,0]+=y*(.76-.32*pan);mix[p:p+n,1]+=y*(.76+.32*pan)
 for k,(s,e) in enumerate(src):
  if s is None:continue
  a=int(s*sr);b=int(e*sr);p=int(borders[k]*sr)
  clip=old[a:b].copy();nn=len(clip)
  fade=min(nn//2,int(.17*sr));ramp=np.linspace(0,1,fade,dtype=np.float32)
  clip[:fade]*=ramp[:,None];clip[-fade:]*=ramp[::-1,None]
  end=min(p+nn,N);mix[p:end]+=clip[:end-p]*.63
 rng=np.random.default_rng(20261123)
 bpm=96;beat=60/bpm
 chords=[[48,55,60,64],[44,51,56,60],[51,58,63,67],[46,53,58,62]]
 def note(midi):return 440*2**((midi-69)/12)
 # Wide string-like pad + evolving upper-mid harmonics + sub bass.
 for k,start in enumerate(np.arange(0,60,beat*8)):
  dur=min(beat*8+1.4,60-start)
  times=np.arange(int(dur*sr),dtype=np.float32)/sr
  env=(1-np.exp(-times*6))*np.minimum(1,(dur-times)/.9)
  sig=np.zeros(len(times),dtype=np.float32)
  for j,midi in enumerate(chords[k%4]):
   f=note(midi)
   sig+=(np.sin(2*np.pi*f*times+math.sin(j)*.23)+.16*np.sin(2*np.pi*f*2.01*times))*.23
  sig*=env*(.85+.14*np.sin(2*np.pi*.17*times))
  putmono(sig,start,.067,-.25 if k%2 else .25)
  subs=np.sin(2*np.pi*note(chords[k%4][0]-12)*times)*env
  putmono(subs,start,.043)
 # Soft original plucks and stereo delay ornaments.
 for k,start in enumerate(np.arange(0,60,beat/2)):
  midi=chords[int(start/(beat*8))%4][[0,2,1,3,2,1,0,2][k%8]]+12
  t=np.arange(int(.68*sr),dtype=np.float32)/sr
  pluck=(np.sin(2*np.pi*note(midi)*t)+.18*np.sin(2*np.pi*note(midi)*2.006*t))*np.exp(-t*6.8)*(1-np.exp(-t*180))
  putmono(pluck,start,.046,math.sin(k*.53)*.65)
  if k%3==0:putmono(pluck*.35,start+.21,.026,-math.sin(k*.53)*.65)
 # Percussion accent on inserts, low-energy transitions between stories.
 for k,stamp in enumerate(borders[1:-1]):
  t=np.arange(int(.9*sr),dtype=np.float32)/sr
  phase=2*np.pi*np.cumsum(47+95*np.exp(-t*12))/sr
  thud=np.sin(phase)*np.exp(-t*13)
  putmono(thud,stamp-.02,.08)
  whoosh=rng.normal(0,1,len(t)).astype(np.float32)
  whoosh=np.convolve(whoosh,np.ones(19,dtype=np.float32)/19,'same')
  whoosh*=np.sin(np.pi*np.clip(t/.9,0,1))**2
  putmono(whoosh,stamp-.52,.065,(-1)**k*.55)
  chime=np.sin(2*np.pi*note(79+((k%3)*2))*t)*np.exp(-t*6)
  putmono(chime,stamp+.02,.037,(-1)**k*.5)
 # Gentle stereo rise near finale; only original synthesis.
 t=np.arange(int(5.5*sr),dtype=np.float32)/sr
 shimmer=(np.sin(2*np.pi*note(84)*t)*.5+np.sin(2*np.pi*note(91)*t)*.3)*np.minimum(1,t/2)*np.exp(-np.maximum(0,t-3.8))
 putmono(shimmer,54.1,.041,pan=.27)
 env=np.minimum(1,np.arange(N,dtype=np.float32)/(1.0*sr))*np.minimum(1,(N-np.arange(N,dtype=np.float32))/(1.1*sr))
 mix*=env[:,None]
 mix=np.tanh(mix*1.42)
 peak=max(.01,float(np.max(np.abs(mix))));mix*=.88/max(.88,peak)
 with wave.open(str(out),'wb') as wav:
  wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(sr)
  wav.writeframes((mix*32767).astype('<i2').tobytes())
 print('AUDIO',round(float(np.sqrt(np.mean(mix**2))),4),'rms',round(peak,4),'raw peak',flush=True)

def run(args):
 base=Path(args.base).resolve();out=Path(args.out).resolve();teaser=Path(args.teaser).resolve()
 if not base.exists():raise FileNotFoundError(base)
 out.parent.mkdir(parents=True,exist_ok=True);teaser.parent.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory(prefix='cinema-v3-') as folder:
  p=Path(folder);clips=[]
  for i in range(4):
   dst=p/f'extra{i}.mp4';render_extra_clip(i,dst);clips.append(dst)
  sound=p/'enhanced.wav';soundtrack(base,sound)
  # ffmpeg segments original + new source, exact 60 sec concatenated;
  # encode at high-quality CRF 18 after a single filtergraph pass.
  ff=['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(base)]
  for clip in clips:ff+=['-i',str(clip)]
  ff+=['-i',str(sound)]
  parts=[];pieces=[]
  for i,(start,end) in enumerate(SPLITS):
   parts.append(f'[0:v]trim=start={start}:end={end},setpts=PTS-STARTPTS,fps={FPS},format=yuv420p[orig{i}]')
   pieces.append(f'[orig{i}]')
   if i<4:
    parts.append(f'[{i+1}:v]setpts=PTS-STARTPTS,fps={FPS},format=yuv420p[insert{i}]')
    pieces.append(f'[insert{i}]')
  parts.append(''.join(pieces)+f'concat=n=9:v=1:a=0,format=yuv420p[vout]')
  command=ff+['-filter_complex',';'.join(parts),'-map','[vout]','-map','5:a:0','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','44100','-ac','2','-movflags','+faststart','-t','60',str(out)]
  print('ENCODING 60-second final film',flush=True)
  subprocess.run(command,check=True)
  print('GENERATING 6-second hover teaser',flush=True)
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','26','-i',str(out),'-t','6','-an','-vf','scale=480:270:flags=lanczos,fps=16','-c:v','libvpx-vp9','-b:v','270k','-crf','35','-deadline','realtime','-cpu-used','5','-pix_fmt','yuv420p',str(teaser)],check=True)
  # Check actual decode and exact metadata of BOTH delivered assets.
  for item in (out,teaser):
   data=subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,channels','-of','json',str(item)],text=True)
   print('VERIFIED',item.name,data[:800],flush=True)
  subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(out),'-f','null','-'],check=True)
 print('DONE',out.stat().st_size,teaser.stat().st_size,flush=True)

if __name__=='__main__':
 ap=argparse.ArgumentParser()
 ap.add_argument('--base',default='media/sudip-das-professional-introduction-720p.mp4')
 ap.add_argument('--out',default='media/sudip-das-professional-introduction-720p.mp4')
 ap.add_argument('--teaser',default='media/sudip-das-intro-hover-preview.webm')
 run(ap.parse_args())