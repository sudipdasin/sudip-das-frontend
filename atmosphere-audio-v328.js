/* Atmosphere Audio v3.28 — original synthesized soundscapes and interaction cues.
 * Strictly opt-in: no AudioContext, oscillators or playback before a click.
 * No external tracks, copyrighted melodies, microphones, recording or network.
 */
(()=>{'use strict';
if((window.PORTFOLIO_PREVIEW_MODE!==true&&window.PORTFOLIO_VISITOR_FEATURES!==true)||window.__wsAtmosphereAudio328)return;
const host=document.querySelector('#ws-atmosphere-control .ws-atmo-menu');
if(!host)return;
const THEMES=Object.freeze({
 orbit:{base:196,intervals:[0,7,12,19,14],type:'sine'},
 editorial:{base:220,intervals:[0,4,7,12,7],type:'triangle'},
 terminal:{base:164.81,intervals:[0,12,7,19,5],type:'square'},
 'aurora-peak':{base:174.61,intervals:[0,5,9,12,7],type:'sine'},
 'neon-studio':{base:246.94,intervals:[0,7,14,12,5],type:'triangle'},
 'design-2':{base:130.81,intervals:[0,3,10,15,12],type:'sine'}
});
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const root=make('fieldset','ws-atmo-audio');root.id='ws-atmosphere-audio';
const title=make('legend','ws-atmo-audio-title','Optional sound');
const note=make('p','ws-atmo-audio-info','Silent by default. Enable original soundscapes or gentle interface sounds.');
const fxLabel=make('label','ws-atmo-audio-toggle');
const effects=make('input');effects.type='checkbox';effects.id='ws-audio-ui-sounds';
fxLabel.append(effects,make('span','','Interface sounds'));
const musicLabel=make('label','ws-atmo-audio-toggle');
const music=make('input');music.type='checkbox';music.id='ws-audio-soundscape';
musicLabel.append(music,make('span','','Ambient music'));
const volumeLabel=make('label','ws-atmo-audio-volume');
const volumeText=make('span','','Volume');
const volume=make('input');volume.type='range';volume.min='0';volume.max='100';
volume.step='5';volume.value='30';volume.id='ws-audio-volume';
volume.setAttribute('aria-label','Volume');
volumeLabel.append(volumeText,volume);
const status=make('p','ws-atmo-audio-status','Sound off');
status.setAttribute('role','status');status.setAttribute('aria-live','polite');
root.append(title,note,fxLabel,musicLabel,volumeLabel,status);
host.append(root);
let ctx=null,master=null,step=0,timer=0,sessionConsent=false,lastFx=0;
const creator=window.AudioContext||window.webkitAudioContext;
const audible=()=>Boolean(effects.checked||music.checked);
function theme(){return THEMES[document.body.dataset.theme]||THEMES['neon-studio']}
async function ready(){
 if(!creator)throw Error('Audio is unavailable');
 if(!ctx){
  ctx=new creator();master=ctx.createGain();
  master.gain.value=0;
  master.connect(ctx.destination);
 }
 if(ctx.state==='suspended')await ctx.resume();
 master.gain.setTargetAtTime((+volume.value/100)*.17,ctx.currentTime,.04);
 sessionConsent=true;return true;
}
function noteAt(freq,duration=0.22,brightness=.5,kind='sine'){
 if(!ctx||ctx.state!=='running'||!master)return false;
 const now=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type=kind;osc.frequency.setValueAtTime(Math.max(85,Math.min(1800,freq)),now);
 gain.gain.setValueAtTime(.0001,now);
 gain.gain.exponentialRampToValueAtTime(Math.max(.0002,Math.min(.6,brightness)),now+.025);
 gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
 osc.connect(gain);gain.connect(master);osc.start(now);osc.stop(now+duration+.035);
 osc.onended=()=>{try{osc.disconnect();gain.disconnect()}catch{}};
 return true;
}
function clearMusic(){if(timer){clearTimeout(timer);timer=0}}
function musicTick(){
 clearMusic();
 if(!music.checked||document.visibilityState==='hidden'||!sessionConsent||!ctx||ctx.state!=='running')return;
 const t=theme(),semitones=t.intervals[step%t.intervals.length],octave=step%8>=5?.5:1;
 const frequency=t.base*Math.pow(2,semitones/12)*octave;
 noteAt(frequency,2.8,t.type==='square'?.11:.25,t.type);
 if(step%4===0&&t.type!=='square')noteAt(frequency*.5,3.3,.11,'sine');
 step=(step+1)%80;
 timer=setTimeout(musicTick,t.type==='square'?1700:3000);
}
function setMessage(message){status.textContent=message}
async function toggle(){
 try{
  if(!audible()){
   clearMusic();step=0;setMessage('Sound off');
   if(master&&ctx)master.gain.setTargetAtTime(0,ctx.currentTime,.05);
   return;
  }
  await ready();
  if(effects.checked)noteAt(theme().base*2,.11,.16,'sine');
  if(music.checked){musicTick();setMessage('Original soundscape playing')}
  else{clearMusic();setMessage('Interface sounds enabled')}
 }catch{
  effects.checked=false;music.checked=false;clearMusic();
  setMessage('Audio unavailable in this browser');
 }
}
effects.addEventListener('change',toggle);
music.addEventListener('change',toggle);
volume.addEventListener('input',()=>{
 if(ctx&&master)master.gain.setTargetAtTime((+volume.value/100)*.17,ctx.currentTime,.03);
});
document.addEventListener('click',event=>{
 if(!effects.checked||!sessionConsent||root.contains(event.target))return;
 if(document.visibilityState==='hidden')return;
 if(Date.now()-lastFx<90)return;
 const target=event.target?.closest?.('button:not([disabled]),a[href],[role="tab"],summary');
 if(!target)return;
 lastFx=Date.now();
 const t=theme();
 noteAt(t.base*Math.pow(2,7/12),.09,t.type==='square'?.08:.12,t.type);
},{passive:true});
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='hidden'){
  clearMusic();ctx?.suspend?.().catch(()=>{});
 }else if(audible()&&sessionConsent){
  ctx?.resume?.().then(()=>{if(music.checked)musicTick()}).catch(()=>{});
 }
});
document.getElementById('theme-select')?.addEventListener('change',()=>{
 step=0;if(music.checked&&sessionConsent)musicTick();
});
window.addEventListener('pagehide',()=>{clearMusic();ctx?.suspend?.().catch(()=>{})});
window.__wsAtmosphereAudio328=Object.freeze({
 getStatus:()=>Object.freeze({effects:effects.checked,music:music.checked,volume:+volume.value,
  theme:document.body.dataset.theme,initialized:!!ctx,consented:sessionConsent}),
 stop:()=>{effects.checked=false;music.checked=false;clearMusic();setMessage('Sound off');
  if(master&&ctx)master.gain.setTargetAtTime(0,ctx.currentTime,.05)}
});
})();