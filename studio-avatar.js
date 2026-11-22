/* LifeSphere WebStudio: six theme-specific SVG portraits and local-only photo preview. */
(() => {
  'use strict';
  const mount = document.querySelector('.vector-portrait-note');
  const avatar = document.getElementById('avatar');
  const hero = document.querySelector('.hero-art');
  if (!mount || !avatar || !hero) return;
  const KEY = 'devdas-webstudio:avatar-preset:v1';
  const assets = Object.freeze({
    orbit: './avatar-orbit.svg',
    editorial: './avatar-editorial.svg',
    terminal: './avatar-terminal.svg',
    'aurora-peak': './avatar-aurora-peak.svg',
    'neon-studio': './avatar-neon-studio.svg',
    'design-2': './avatar-design-2.svg',
    creative: './studio-creative-avatar.svg',
    professional: './dev-das-portrait.svg'
  });
  let mode = 'auto', photoURL = null, photoPosition = 50;
  try {
    const stored = localStorage.getItem(KEY);
    if (['auto','creative','professional'].includes(stored)) mode = stored;
  } catch {}
  const panel = document.createElement('fieldset');
  panel.className = 'avatar-studio';
  const legend = document.createElement('legend');
  legend.textContent = 'Avatar & identity';
  const intro = document.createElement('p');
  intro.className = 'hint';
  intro.textContent = 'Choose a theme-matched vector avatar or preview your own photo privately. Uploaded photos are never saved, exported, or sent anywhere.';
  const options = document.createElement('div');
  options.className = 'avatar-studio-options';
  const choices = [
    ['auto','Match active theme'],
    ['creative','Creative developer (vector)'],
    ['professional','Professional developer (vector)'],
    ['photo','My photo (preview only)']
  ];
  for (const [value,label] of choices) {
    const item = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio'; radio.name = 'avatar-preset'; radio.value = value;
    radio.checked = mode === value; radio.disabled = value === 'photo';
    item.append(radio, document.createTextNode(label));
    options.append(item);
  }
  const uploadLabel = document.createElement('label');
  uploadLabel.className = 'avatar-studio-upload';
  uploadLabel.textContent = 'Upload photo for local preview (JPEG, PNG or WebP; max 8 MB)';
  const upload = document.createElement('input');
  upload.type = 'file'; upload.accept = 'image/jpeg,image/png,image/webp';
  upload.setAttribute('aria-label','Upload your own photo for local preview');
  uploadLabel.append(upload);
  const positionLabel = document.createElement('label');
  positionLabel.className = 'avatar-studio-position';
  positionLabel.textContent = 'Vertical position';
  const position = document.createElement('input');
  position.type = 'range'; position.min = '0'; position.max = '100'; position.value = '50';
  position.disabled = true;
  position.setAttribute('aria-label','Adjust photo vertical position');
  positionLabel.append(position);
  const reset = document.createElement('button');
  reset.type = 'button'; reset.className = 'ghost';
  reset.textContent = 'Remove uploaded photo';
  reset.disabled = true;
  const status = document.createElement('p');
  status.className = 'hint'; status.setAttribute('role','status');
  panel.append(legend,intro,options,uploadLabel,positionLabel,reset,status);
  mount.replaceWith(panel);

  // Every active theme maps to its OWN SVG asset, not just a color treatment.
  const chooseAuto = () => Object.hasOwn(assets, document.body.dataset.theme)
    && !['creative','professional'].includes(document.body.dataset.theme)
      ? document.body.dataset.theme : 'orbit';
  const effective = () => mode === 'auto' ? chooseAuto() : mode;
  const radios = () => [...panel.querySelectorAll('input[name="avatar-preset"]')];
  let scheduled = false;
  function draw() {
    scheduled = false;
    const next = effective();
    const src = next === 'photo' && photoURL ? photoURL : assets[next] || assets.orbit;
    let image = avatar.querySelector('img[data-avatar-choice]');
    if (!image) {
      image = document.createElement('img');
      image.dataset.avatarChoice = 'true';
      image.className = 'demo-portrait avatar-studio-image';
      image.alt = '';
      image.decoding = 'async';
      avatar.replaceChildren(image);
    }
    if (image.getAttribute('src') !== src) image.setAttribute('src',src);
    // Preserve the artwork geometry of Aurora and Cosmic by putting the SAME
    // selected SVG in their reference-size positioning element.
    const positioned = hero.querySelector('.neon-reference-photo');
    if (positioned && next !== 'photo') {
      if (positioned.getAttribute('src') !== src) positioned.setAttribute('src', src);
      positioned.alt = '';
      positioned.setAttribute('aria-hidden','true');
    }
    image.style.objectPosition = 'center ' + photoPosition + '%';
    document.body.classList.add('avatar-studio-active');
    document.body.dataset.avatarPreset = next;
    hero.setAttribute('aria-label',next==='photo'?'Locally previewed customer photograph':'Fictional developer vector portrait, '+next+' style');
    radios().forEach(r => {r.checked = r.value === mode;r.disabled = r.value === 'photo' && !photoURL;});
    position.disabled = next !== 'photo';reset.disabled = !photoURL;
    status.textContent = next === 'photo'
      ? 'Local photo preview only. Exported JSON will not contain your photo.'
      : 'Using '+next.replaceAll('-', ' ')+' vector avatar' + (mode === 'auto' ? ' (automatically changed with the selected theme).' : ' (manually selected).');
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(draw);
  }
  function forgetPhoto() {
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = null;
    upload.value = '';
    photoPosition = 50; position.value='50';
  }
  options.addEventListener('change', event => {
    const chosen = event.target.value;
    if (!['auto','creative','professional','photo'].includes(chosen) || (chosen === 'photo' && !photoURL)) return;
    mode = chosen;
    if (mode !== 'photo') {try {localStorage.setItem(KEY,mode);} catch {}}
    schedule();
  });
  upload.addEventListener('change', async () => {
    const file = upload.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024 || file.size < 20) {
      upload.value = '';
      status.textContent = 'Choose a valid JPEG, PNG or WebP image no larger than 8 MB.';
      return;
    }
    const header = new Uint8Array(await file.slice(0,12).arrayBuffer());
    const isJPEG = header[0]===0xff && header[1]===0xd8 && header[2]===0xff;
    const isPNG = header[0]===0x89 && header[1]===0x50 && header[2]===0x4e && header[3]===0x47;
    const isWEBP = String.fromCharCode(...header.slice(0,4))==='RIFF' && String.fromCharCode(...header.slice(8,12))==='WEBP';
    if (!((file.type==='image/jpeg' && isJPEG) || (file.type==='image/png' && isPNG) || (file.type==='image/webp' && isWEBP))) {
      upload.value = ''; status.textContent='Rejected: file content does not match its image type.'; return;
    }
    const candidate = URL.createObjectURL(file);
    try {
      const probe = new Image();
      probe.src = candidate;
      await probe.decode();
      if (!probe.naturalWidth || !probe.naturalHeight || probe.naturalWidth > 8192 || probe.naturalHeight > 8192) throw Error('Unsupported image dimensions');
      forgetPhoto();
      photoURL = candidate;
      mode = 'photo';
      schedule();
    } catch {
      URL.revokeObjectURL(candidate);
      upload.value='';
      status.textContent='Image could not be decoded safely. Please choose another photo.';
    }
  });
  position.addEventListener('input',()=>{photoPosition=Number(position.value);schedule();});
  reset.addEventListener('click',()=>{forgetPhoto();mode='auto';try{localStorage.setItem(KEY,mode);}catch{}schedule();});
  new MutationObserver(schedule).observe(avatar,{childList:true});
  new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-theme']});
  window.addEventListener('pagehide',()=>{if(photoURL) URL.revokeObjectURL(photoURL);},{once:true});
  schedule();
})();
