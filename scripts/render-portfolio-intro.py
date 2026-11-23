#!/usr/bin/env python3
"""Original v2.1, self-contained, offline 1280x720 portfolio introduction.
Content is sourced from approved public sudip-das-frontend portfolio copy.
No private CV details, external music, proprietary logos, or network access.
Usage: python portfolio_intro_render.py [--seconds 44] [--fps 24]
"""
import math, os, random, argparse, subprocess, time, json, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy.signal import butter, sosfilt

ap=argparse.ArgumentParser();ap.add_argument('--seconds',type=float,default=44.0);ap.add_argument('--fps',type=int,default=24);ap.add_argument('--out',default='/mnt/data/sudip-das-professional-introduction-720p.mp4');args=ap.parse_args()
OUT=Path(args.out);OUT.parent.mkdir(parents=True,exist_ok=True)
W,H=1280,720;FPS=args.fps;DUR=args.seconds
FONTROOT='/usr/share/fonts/opentype/inter'
FONTB=FONTROOT+'/InterDisplay-Bold.otf';FONTR=FONTROOT+'/InterDisplay-Regular.otf';FONTL=FONTROOT+'/InterDisplay-Light.otf'
if not Path(FONTR).exists():FONTR='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
if not Path(FONTB).exists():FONTB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
SERIF='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
def ft(px,bold=False,serif=False):return ImageFont.truetype(SERIF if serif else (FONTB if bold else FONTR),px)
F={n:ft(n) for n in [14,15,16,17,18,19,20,21,22,23,24,26,28,30,32,34,36,40,45,48,50,52,54,56,61,64,68,70,74,78,80,88,96,105]}
FB={n:ft(n,True) for n in F};FS={n:ft(n,serif=True) for n in [40,45,50,54,61,64,68,70,74,78,80,88,96,105]}
TEAL=(97,235,214);WARM=(241,182,134);INK=(229,244,245);DIM=(151,181,193);PURPLE=(155,150,251)
def rgb(c,a=255):return tuple(c)+(a,)
def clamp(v,a=0,b=1):return max(a,min(b,v))
def ease(x):x=clamp(x);return x*x*(3-2*x)
def out(x):return 1-(1-clamp(x))**3
def fade_window(local,total):return ease(local/.55)*ease((total-local)/.65)
def lerp(a,b,p):return a+(b-a)*p

def fontfit(draw,msg,maxw,fontsize=70,bold=True,minsize=28):
 for n in range(fontsize,minsize-1,-2):
  f=ft(n,bold);w=draw.textbbox((0,0),msg,font=f)[2]
  if w<=maxw:return f
 return ft(minsize,bold)

def text(draw,xy,s,font=F[24],fill=INK,anchor=None,stroke=0):
 draw.text(tuple(map(int,xy)),s,font=font,fill=fill,anchor=anchor,stroke_width=stroke,stroke_fill=(2,12,24) if stroke else None)

def roundbox(draw,rect,radius=20,fill=(15,36,50,245),outline=(69,119,137,255),width=2):
 draw.rounded_rectangle(tuple(int(x) for x in rect),radius=int(radius),fill=fill,outline=outline,width=width)

def line(draw,points,color=TEAL,width=2):draw.line([(int(x),int(y)) for x,y in points],fill=color,width=width,joint='curve')

def glow_circle(draw,cx,cy,r,base=TEAL,intensity=1):
 for mult,alpha in [(2.4,7),(1.8,10),(1.32,14)]:
  rr=r*mult;draw.ellipse((int(cx-rr),int(cy-rr),int(cx+rr),int(cy+rr)),fill=rgb(base,int(alpha*intensity)))
 draw.ellipse((int(cx-r),int(cy-r),int(cx+r),int(cy+r)),fill=rgb(base,int(255*min(intensity,1))))

# Native-resolution, precomputed gradient per scene; compositing stays 720p.
ys=np.arange(H,dtype=np.float32)[:,None,None];xs=np.arange(W,dtype=np.float32)[None,:,None]
basegrad=np.broadcast_to((xs/W)*1.0,(H,W,1))
backgrounds=[]
for s in range(9):
 theme=[(6,17,32),(9,25,39),(12,22,40),(7,23,36),(7,22,38),(16,20,44),(8,27,40),(12,24,37),(7,23,32)][s]
 right=[(23,54,68),(20,56,69),(24,39,64),(18,47,59),(20,45,65),(39,34,69),(15,57,63),(33,43,58),(20,54,61)][s]
 t=np.minimum(1.0,((xs/W)*.77+(ys/H)*.23))
 x=np.zeros((H,W,3),dtype=np.uint8)
 for k in range(3):x[:,:,k]=(theme[k]*(1-t[:,:,0])+right[k]*t[:,:,0]).astype(np.uint8)
 xx=(xs-W*(.77 if s%2==0 else .22))/W;yy=(ys-H*.37)/H
 light=np.exp(-((xx**2)*8+(yy**2)*7))[...,0]
 x=np.clip(x+light[...,None]*np.array([7.,17.,22.]),0,255).astype(np.uint8)
 backgrounds.append(Image.fromarray(x,'RGB').convert('RGBA'))

rng=random.Random(2309)
particles=[(rng.randrange(W),rng.randrange(H),rng.choice([1,1,1,2]),rng.uniform(.18,.95),rng.uniform(.05,.36)) for _ in range(88)]

def bg_scene(img,draw,scene,t):
 # fine art-directed grid + technical markers
 a=32
 for ix in range(54,W,72):
  draw.line((ix,0,ix,H),fill=(83,166,173,12),width=1)
 for iy in range(42,H,72):draw.line((0,iy,W,iy),fill=(79,142,166,12),width=1)
 for i,(x,y,r,speed,alpha) in enumerate(particles):
  xx=(x+math.sin(t*.42*speed+i)*9)%W
  yy=(y+t*speed*4)%H
  v=int(70+70*(.5+.5*math.sin(t*1.1+i)))
  draw.ellipse((xx-r,yy-r,xx+r,yy+r),fill=(92,219,226,max(0,int(v*alpha))))
 # translucent oversized orbital rings shift slowly behind text
 cx=985+int(20*math.sin(t*.25));cy=330+int(8*math.cos(t*.2))
 for radius in (176,245,318):
  draw.arc((cx-radius,cy-radius,cx+radius,cy+radius),20+t*2,190+t*2,fill=(81,188,208,34),width=2)
 # horizontal bottom sheen
 draw.rectangle((0,710,W,H),fill=(61,153,167,22))

# Each chapter has a different art system on right third.
def art_orbit(draw,t,p):
 cx,cy=992,337
 for r,c,phase in [(170,TEAL,0),(231,PURPLE,1),(280,WARM,2)]:
  draw.arc((cx-r,cy-r,cx+r,cy+r),-75+t*17+phase*35,135+t*17+phase*35,fill=rgb(c,155),width=3)
  draw.arc((cx-r,cy-r,cx+r,cy+r),175-t*10,225-t*10,fill=rgb(c,90),width=2)
  ang=(t*(.55+phase*.16)+phase*2.0)
  x=cx+int(r*math.cos(ang));y=cy+int(r*math.sin(ang));glow_circle(draw,x,y,6,c)
 for r in range(84,20,-22):
  draw.ellipse((cx-r,cy-r,cx+r,cy+r),outline=(87,236,223,max(40,170-r)),width=2)
 draw.ellipse((cx-30,cy-30,cx+30,cy+30),fill=(22,77,79,220),outline=rgb(TEAL),width=2)
 text(draw,(cx,cy),'SD',FB[22],INK,'mm')

def art_world(draw,t,p):
 # dignified global network rather than fictional geography or employer logos
 nodes=[(850,205),(945,156),(1056,211),(1138,300),(1055,376),(934,365),(834,435),(1090,492),(954,523),(770,334)]
 edges=[(0,1),(1,2),(2,3),(3,4),(4,5),(5,0),(5,6),(6,9),(9,0),(6,8),(8,7),(7,4),(5,8),(2,4)]
 for a,b in edges:
  x,y=nodes[a];xx,yy=nodes[b]
  line(draw,[(x,y),(xx,yy)],(72,152,167,85),2)
  q=(t*.21+(a+b)*.13)%1
  xp=lerp(x,xx,q);yp=lerp(y,yy,q);glow_circle(draw,xp,yp,2,WARM)
 for i,(x,y) in enumerate(nodes):glow_circle(draw,x,y,4,TEAL,0.7)
 roundbox(draw,(800,250,1000,310),12,(14,49,58,220),(78,158,170,145))
 text(draw,(822,268),'SUPPORT / CRM',FB[16],INK)

def art_people(draw,t,p):
 cx,cy=965,324
 for i in range(8):
  ang=i*math.tau/8+.06*math.sin(t*.22)
  rad=185+(i%3)*24
  x=cx+math.cos(ang)*rad;y=cy+math.sin(ang)*rad
  line(draw,[(cx,cy),(x,y)],(103,173,184,94),2)
  glow_circle(draw,x,y,10,WARM if i%2 else TEAL,.9)
  draw.ellipse((x-21,y+16,x+21,y+53),outline=(130,209,213,90),width=2)
 roundbox(draw,(899,258,1031,386),20,(21,57,69,240),(95,214,211,170))
 text(draw,(965,302),'PEOPLE',FB[21],INK,'mm')
 text(draw,(965,340),'FIRST',FB[24],TEAL,'mm')

def art_system(draw,t,p):
 # database / dashboard columns / SQL pipeline
 for i,(x,y) in enumerate([(802,220),(938,172),(1082,220)]):
  w,h=104,64
  roundbox(draw,(x,y,x+w,y+h),13,(15,49,63,218),(71,165,180,158))
  text(draw,(x+13,y+16),['SQL','CRM','MIS'][i],FB[24],TEAL)
  if i<2:
   line(draw,[(x+w,y+31),(x+w+32,y+31),(x+w+32,204),(938 if i==0 else 1082,204)],(99,203,201,150),3)
 roundbox(draw,(790,332,1200,494),16,(12,38,56,238),(67,117,137,210))
 for row in range(4):
  y=362+row*32
  draw.rounded_rectangle((815,y,865,y+11),radius=4,fill=(68,126,144,140))
  v=130+(math.sin(t*.9+row*1.8)*.5+.5)*130
  draw.rounded_rectangle((889,y,889+v,y+11),radius=4,fill=rgb(TEAL,130+int(60*math.sin(t+row)**2)))
 text(draw,(818,510),'DATA → INSIGHT → ACTION',FB[17],DIM)

def art_linux(draw,t,p):
 # stylized Linux window and task controls, not misrepresented screenshot
 roundbox(draw,(757,160,1215,540),20,(11,37,54,242),(91,183,195,170),2)
 draw.rounded_rectangle((759,162,1213,212),radius=16,fill=(20,66,77,248))
 for i,col in enumerate([WARM,TEAL,PURPLE]):glow_circle(draw,786+i*26,186,6,col)
 text(draw,(897,176),'LINUX · DESKTOP',FB[16],INK)
 for i in range(4):
  y=244+i*60
  roundbox(draw,(782,y,878,y+46),8,(22,55,68,230),(59,109,129,180))
  text(draw,(795,y+13),['CPU','RAM','DISK','NET'][i],FB[14],TEAL)
  v=207+int(70*math.sin(t*.64+i))
  draw.rounded_rectangle((897,y+10,897+max(50,v),y+35),radius=6,fill=(39,98,109,120))
  draw.rounded_rectangle((897,y+10,897+max(50,v)*.55,y+35),radius=6,fill=(76,211,199,190))
 text(draw,(781,505),'SIMPLE. CLEAR. APPROACHABLE.',FB[17],INK)

def art_creative(draw,t,p):
 cx,cy=987,328
 # editor media composition and waveforms
 roundbox(draw,(758,174,1209,522),18,(14,35,56,230),(82,158,186,180))
 draw.rounded_rectangle((777,200,1189,406),radius=10,fill=(22,48,79,220))
 # faux image: hills / sunrise
 draw.ellipse((1081,212,1179,310),fill=(234,181,124,180))
 polygon=[(785,375),(864,274),(942,350),(1023,245),(1122,357),(1180,295),(1180,398),(785,398)]
 draw.polygon(polygon,fill=(64,108,150,215))
 draw.polygon([(786,394),(904,331),(991,390),(1089,323),(1185,384),(1185,402),(786,402)],fill=(66,184,169,185))
 for j in range(40):
  x=787+j*9.8;ampl=13+11*math.sin(t*.7+j*.26)
  y=463+math.sin(j*.65+t*1.5)*ampl
  line(draw,[(x,462-ampl),(x,462+ampl)],(87,231,209,130),2)
 for x in (845,1019,1127):draw.line((x,432,x,490),fill=(238,179,134,75),width=2)

def art_open(draw,t,p):
 # branch graph, contributor nodes
 nodes=[(830,260),(925,205),(1045,250),(1164,195),(1004,345),(1120,422),(904,463),(810,420)]
 links=[(0,1),(1,2),(2,3),(0,7),(7,6),(6,4),(2,4),(4,5),(3,5)]
 for i,j in links:line(draw,[nodes[i],nodes[j]],(90,195,195,150),3)
 for i,(x,y) in enumerate(nodes):
  glow_circle(draw,x,y,11,TEAL if i%3 else WARM,.8)
  if i<4:text(draw,(x+15,y-22),['CODE','IDEAS','REVIEW','SHARE'][i],FB[16],INK)
 roundbox(draw,(820,515,1148,574),12,(19,60,70,190),(78,155,162,165))
 text(draw,(845,532),'BUILT TO BE IMPROVED',FB[17],INK)

def art_strengths(draw,t,p):
 labels=['SYSTEMS','SERVICE','PEOPLE','BUILDING']
 x0,y0=746,189
 for i,label in enumerate(labels):
  x=x0+(i%2)*235;y=y0+(i//2)*168
  a=out((p-i*.09)*3)
  dy=(1-a)*25
  roundbox(draw,(x,y+dy,x+218,y+145+dy),14,(14,48,63,int(220*a)),(83,169,181,int(140*a)),2)
  text(draw,(x+22,y+21+dy),f'0{i+1}',FB[20],WARM)
  text(draw,(x+22,y+68+dy),label,FB[23],INK)
  draw.rectangle((x+22,y+119+dy,x+130,y+123+dy),fill=rgb(TEAL,int(190*a)))

def art_final(draw,t,p):
 cx,cy=986,334
 for i in range(4):
  r=108+i*52;ang=(t*14+i*31)
  draw.arc((cx-r,cy-r,cx+r,cy+r),ang-35,ang+150,fill=rgb(TEAL if i%2==0 else WARM,165-i*23),width=3)
 glow_circle(draw,cx,cy,38,TEAL,.64)
 text(draw,(cx,cy),'SD',FB[52],INK,'mm')

scenes=[
 (0,4.8,'01 / THE INTRODUCTION','TECHNOLOGY','WITH PURPOSE','Sudip Das  ·  Technology professional & independent builder',art_orbit),
 (4.8,10.0,'02 / THE FOUNDATION','ENTERPRISE IT.','HUMAN CLARITY.','CRM platforms  ·  Global technical support  ·  Systems',art_world),
 (10,15.0,'03 / THE PEOPLE','PEOPLE MAKE','THE DIFFERENCE.','Team leadership  ·  Collaboration  ·  Service delivery',art_people),
 (15,20.0,'04 / THE PRACTICE','FROM COMPLEXITY','TO CLARITY.','SQL  ·  Automation  ·  Business systems  ·  MIS',art_system),
 (20,25.3,'05 / LINUX','MAKE TECHNOLOGY','APPROACHABLE.','LinWin  ·  Tux Steward   |   Public projects in development',art_linux),
 (25.3,30.4,'06 / CREATIVE TECHNOLOGY','IMAGINATION,','IN MOTION.','iVivid  ·  Animation Studio   |   Creative tools and workflows',art_creative),
 (30.4,35.3,'07 / OPEN SOURCE','BUILD. SHARE.','IMPROVE.','Open-source collaboration  ·  Community-driven ideas',art_open),
 (35.3,39.8,'08 / THE STRENGTHS','SYSTEMS. SERVICE.','PEOPLE. BUILDING.','Technical depth with operational judgment and communication',art_strengths),
 (39.8,DUR,'09 / THE NEXT CHAPTER','LET’S MAKE','SOMETHING USEFUL.','Collaborate  ·  Connect  ·  Explore the projects',art_final),
]

WARM_N=(251,186,141)

# V2.1: proof details sourced from the published public portfolio; no
# fictional company claims, private history, or external media.
PUBLIC_EVIDENCE=[
 'TECHNOLOGY, BUILT FOR PEOPLE',
 '1,000+ CRM USERS SUPPORTED ACROSS REGIONS',
 'TEAMS OF 5 TO 20+',
 '200+ USERS SERVED BY A CUSTOM MIS',
 'LINUX DESKTOP AND SYSTEM TOOLS',
 'CREATIVE SOFTWARE IN DEVELOPMENT',
 'OPEN SOURCE / COMMUNITY CONTRIBUTIONS',
 'TECHNICAL DEPTH + HUMAN JUDGMENT',
 'GITHUB.COM/SUDIPDASIN'
]

def draw_chapter_signature(draw,scene,local,dur,t):
 visibility=out((local-.45)/.6)*ease((dur-local)/.45)
 label=PUBLIC_EVIDENCE[scene]
 width=draw.textbbox((0,0),label,font=FB[16])[2]
 right=min(680,max(340,104+width))
 endpoint=76+(right-76)*visibility
 draw.rounded_rectangle((75,551,endpoint,590),radius=8,
   fill=(12,42,55,int(175*visibility)),
   outline=(80,181,186,int(105*visibility)),width=1)
 if visibility>.34:text(draw,(92,562),label,FB[16],INK)
 # Chapter navigation is legible without sound. The current part glows.
 for i in range(9):
  x=76+i*46
  col=TEAL if i==scene else ((130,178,187) if i<scene else (75,113,127))
  w=32 if i==scene else 21
  draw.rounded_rectangle((x,611,x+w,615),radius=2,
    fill=rgb(col,226 if i==scene else 115))
 sweep=out(local/.68)
 draw.rounded_rectangle((1150,610,1150+int(54*sweep),612),
   radius=1,fill=rgb(WARM,172))

def draw_title(draw,scene,tlocal,dur,h1,h2,subtitle,chapter):
 entrance=out((tlocal-.12)/.68)
 exitv=ease((dur-tlocal)/.64)
 a=entrance*exitv
 dx=(1-entrance)*(-34)
 x=76+dx
 # Chapter eyebrow + segmented number line
 text(draw,(x,90),chapter,FB[18],WARM)
 draw.rectangle((x,122,x+int(195*entrance),125),fill=rgb(TEAL,int(205*a)))
 # Fit both lines in left column; typographic hierarchy in two lanes
 title_font=fontfit(draw,h1,648,70,True,39)
 title2_font=fontfit(draw,h2,645,65,True,38)
 tstart=251 if scene!=7 else 248
 text(draw,(x,tstart),h1,title_font,INK)
 text(draw,(x,tstart+83),h2,title2_font,TEAL if scene in (0,4,6,8) else INK)
 # thin focal line and narrative
 y=tstart+182
 draw.line((x,y,x+int(66*entrance),y),fill=rgb(WARM,205),width=4)
 # Word wrap subtitle to avoid collision with illustration; max width 610
 words=subtitle.split();rows=[];row=''
 for word in words:
  cand=row+' '+word if row else word
  if draw.textbbox((0,0),cand,font=F[22])[2]>610 and row:
   rows.append(row);row=word
  else:row=cand
 if row:rows.append(row)
 for i,part in enumerate(rows[:3]):text(draw,(x,y+28+i*33),part,F[22],DIM)
 # bottom metadata; hold in every chapter
 text(draw,(76,651),'SUDIP DAS  /  PROFESSIONAL INTRODUCTION',FB[15],(172,206,213))
 text(draw,(1203,651),f'{scene+1:02d} / 09',FB[15],(160,199,208),'ra')


def draw_frame(n):
 t=n/FPS
 si=min(8,next((i for i in range(9) if t>=scenes[i][0] and t<scenes[i][1]),8))
 start,end,eyebrow,h1,h2,subtitle,art=scenes[si]
 local=t-start;dur=end-start;p=clamp(local/dur)
 im=backgrounds[si].copy();layer=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(layer)
 bg_scene(im,d,si,t)
 art(d,t,p)
 # animated luminous scanning marker along top section bar
 draw_top=d
 draw_top.rectangle((0,0,W,5),fill=(39,85,104,135))
 draw_top.rounded_rectangle((0,0,int(W*((t/DUR))),5),radius=2,fill=rgb(TEAL,240))
 draw_title(d,si,local,dur,h1,h2,subtitle,eyebrow)
 draw_chapter_signature(d,si,local,dur,t)
 # Very brief turquoise light-travel wipe between chapters, underneath
 # the existing charcoal crossfade and without harsh flashes.
 if local<.52:
  fade=1-ease(local/.52)
  x=int(-190+(W+380)*ease(local/.52))
  d.polygon([(x-38,0),(x+48,0),(x-76,H),(x-152,H)],
    fill=(118,231,219,int(37*fade)))
 # crossfade scene entrance and exit with a charcoal tint, not a hard cut
 alpha=fade_window(local,dur)
 if alpha<.99:d.rectangle((0,0,W,H),fill=(4,12,22,int(255*(1-alpha)*.92)))
 im.alpha_composite(layer)
 return im.convert('RGB')


def make_audio(duration,filename):
 # Fully original, deterministic cinematic soundtrack synthesised from scratch:
 # wide evolving pads, piano-like pluck, bass pulse, kick, shakers, scene
 # transition swooshes and chimes. No copyrighted recordings/samples used.
 sr=44100;N=int(duration*sr);t=np.arange(N,dtype=np.float32)/sr
 mix=np.zeros((N,2),dtype=np.float32);rnd=np.random.default_rng(20261123)
 def add(sig,start=0,pan=0.0,gain=1.0):
  p=int(start*sr);n=min(len(sig),N-p)
  if p<0 or n<=0:return
  q=np.asarray(sig[:n],dtype=np.float32)*gain
  mix[p:p+n,0]+=q*(.75-.33*pan)
  mix[p:p+n,1]+=q*(.75+.33*pan)
 def envs(n,attack,release,hold=None):
  e=np.ones(n,dtype=np.float32)
  a=max(1,int(attack*sr));b=max(1,int(release*sr))
  e[:min(a,n)]*=np.linspace(0,1,min(a,n),dtype=np.float32)
  e[-min(b,n):]*=np.linspace(1,0,min(b,n),dtype=np.float32)
  return e
 chords=[[48,55,60,63],[44,51,56,60],[51,58,63,67],[46,53,58,62]]
 # 4 bars cyclic progression, BPM 96, each chord 5 sec approx
 bpm=96;beat=60/bpm; chord_dur=8*beat
 for ci,start in enumerate(np.arange(0,duration,chord_dur)):
  notes=chords[ci%4];length=min(chord_dur+1.1,duration-start)
  ns=int(length*sr);tt=np.arange(ns,dtype=np.float32)/sr;pad=np.zeros(ns,dtype=np.float32)
  for k,midi in enumerate(notes):
   freq=440*2**((midi-69)/12)
   phase=2*np.pi*freq*tt
   pad+=(np.sin(phase)+.19*np.sin(2*phase+.3*k)+.11*np.sin(phase*.501))*.25
  wobble=(.68+.27*np.sin(2*np.pi*.13*tt))
  pad*=wobble*envs(ns,.35,.95)
  add(pad,start,pan=(-.35 if ci%2 else .35),gain=.074)
  # soft low-end root supporting cinematic progression
  root=440*2**((notes[0]-81)/12)
  bass=(np.sin(2*np.pi*root*tt)+.15*np.sin(4*np.pi*root*tt))*envs(ns,.07,.7)
  add(bass,start,pan=0,gain=.063)
 # clear, soft arpeggios with resonant bell overtones and stereo echoes
 for step,start in enumerate(np.arange(0,duration,beat/2)):
  cid=int(start//chord_dur)%4;notes=chords[cid]
  midi=notes[[0,2,1,3,2,1,0,2][step%8]]+12
  freq=440*2**((midi-69)/12)
  ns=int(.48*sr);tt=np.arange(ns,dtype=np.float32)/sr
  tone=(np.sin(2*np.pi*freq*tt)+.23*np.sin(2*np.pi*freq*2.004*tt))
  tone*=np.exp(-tt*7.2)*(1-np.exp(-tt*150))
  add(tone,start,pan=math.sin(step*.65)*.6,gain=.073)
  if step%3==0:add(tone*.55,start+.24,pan=-math.sin(step*.65)*.6,gain=.043)
 # restrained synthetic percussion, slightly busier in project chapter
 for i,start in enumerate(np.arange(0,duration,beat)):
  ns=int(.18*sr);tt=np.arange(ns,dtype=np.float32)/sr
  f=68*np.exp(-tt*28)+44
  phase=2*np.pi*np.cumsum(f)/sr
  kick=np.sin(phase)*np.exp(-tt*34)
  add(kick,start,gain=.16 if i%4==0 else .058)
  if i%2==1:
   noise=rnd.normal(0,1,ns).astype(np.float32)*np.exp(-tt*36)
   add(noise,start,pan=(-.4 if i%4==1 else .4),gain=.025)
  # hi hat every half beat but very quiet
  for off in (0,beat*.5):
   nn=int(.065*sr);t2=np.arange(nn,dtype=np.float32)/sr
   white=rnd.normal(0,1,nn).astype(np.float32)*np.exp(-t2*80)
   add(white,start+off,pan=(-.7 if i%2 else .7),gain=.013)
 # distinct swoosh and chime at each chapter cut
 for cut in [4.8,10,15,20,25.3,30.4,35.3,39.8]:
  ns=int(.75*sr);tt=np.arange(ns,dtype=np.float32)/sr
  noise=rnd.normal(0,1,ns).astype(np.float32)
  # filtered, rising sweep; normalise and envelope
  sos=butter(3,[500,5300],fs=sr,output='sos',btype='bandpass')
  whoosh=sosfilt(sos,noise).astype(np.float32)
  whoosh/=max(.01,np.max(np.abs(whoosh)))
  whoosh*=np.sin(np.pi*np.clip(tt/.75,0,1))**2
  add(whoosh,cut-.47,pan=-.22,gain=.072)
  nn=int(1.1*sr);t2=np.arange(nn,dtype=np.float32)/sr
  chime=(np.sin(2*np.pi*880*t2)+.42*np.sin(2*np.pi*1320*t2))*np.exp(-t2*4.1)
  add(chime,cut+.04,pan=.35,gain=.036)
 # Original low-frequency sonic emblems at the opening and final invitation.
 for stamp in (0.05,39.8):
  nn=int(1.45*sr);ts=np.arange(nn,dtype=np.float32)/sr
  sweep_freq=55+110*np.exp(-ts*3.2)
  phase=2*np.pi*np.cumsum(sweep_freq)/sr
  impact=(np.sin(phase)+.2*np.sin(2*phase))*np.exp(-ts*3.1)
  add(impact,stamp,pan=0,gain=.055 if stamp<1 else .042)
 # subtle atmospheric air, gain ramps in/out
 for ch in range(2):
  noise=rnd.normal(0,1,N).astype(np.float32)
  smooth=np.convolve(noise,np.ones(22,dtype=np.float32)/22,mode='same')
  mix[:,ch]+=smooth*.007
 envelope=np.minimum(1,t/1.4)*np.minimum(1,(duration-t)/2.0)
 mix*=envelope[:,None]
 mix=np.tanh(mix*1.25)
 peak=np.max(np.abs(mix));mix=mix*(.82/max(peak,.83))
 pcm=np.asarray(mix*32767,dtype='<i2')
 with wave.open(str(filename),'wb') as wf:
  wf.setnchannels(2);wf.setsampwidth(2);wf.setframerate(sr);wf.writeframes(pcm.tobytes())
 return float(np.sqrt(np.mean(mix**2))),float(peak)

if __name__=='__main__':
 start=time.monotonic();video=OUT.with_suffix('.mute.mp4');sound=OUT.with_suffix('.sound.wav')
 print('GENERATING original music and SFX',flush=True)
 stats=make_audio(DUR,sound);print('AUDIO RMS/PEAK',stats,'WAV',sound.stat().st_size,flush=True)
 print('RENDERING',W,'x',H,FPS,'FPS duration',DUR,flush=True)
 ff=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-vcodec','rawvideo',
  '-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','-','-an',
  '-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(video)],stdin=subprocess.PIPE)
 try:
  for n in range(int(DUR*FPS)):
   im=draw_frame(n)
   ff.stdin.write(im.tobytes())
   if n%(FPS*5)==0:print('FRAME',n,'/',int(DUR*FPS),'elapsed',round(time.monotonic()-start,1),flush=True)
 except BrokenPipeError as e:
  raise RuntimeError('FFmpeg terminated prematurely') from e
 finally:
  if ff.stdin:ff.stdin.close()
 ff.wait();
 if ff.returncode:raise RuntimeError('Video encoding failed')
 print('MUXING SOUNDTRACK',flush=True)
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(video),'-i',str(sound),
  '-c:v','copy','-c:a','aac','-b:a','192k','-ar','44100','-ac','2','-movflags','+faststart','-shortest',str(OUT)],check=True)
 sound.unlink(missing_ok=True);video.unlink(missing_ok=True)
 print('COMPLETE',str(OUT),'bytes',OUT.stat().st_size,'elapsed',round(time.monotonic()-start,1),flush=True)