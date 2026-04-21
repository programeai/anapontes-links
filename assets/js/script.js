const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroBg": "tan",
  "frameWidth": "wide",
  "cardShape": "soft",
  "watermark": true
}/*EDITMODE-END*/;

const state = { ...TWEAK_DEFAULTS };

const HERO_BGS = {
  tan:  `radial-gradient(120% 80% at 50% 12%, rgba(255,255,255,.32) 0%, rgba(255,255,255,0) 55%),
         radial-gradient(90% 65% at 50% 115%, rgba(129,90,46,.28) 0%, rgba(129,90,46,0) 60%),
         linear-gradient(165deg, #eed4b3 0%, #e1c9aa 45%, #c9a87e 100%)`,
  warm: `radial-gradient(120% 80% at 50% 12%, rgba(255,255,255,.5) 0%, rgba(255,255,255,0) 60%),
         linear-gradient(165deg, #fcf5ed 0%, #f7eadc 50%, #ead6bb 100%)`,
  gold: `radial-gradient(120% 80% at 50% 12%, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 55%),
         linear-gradient(165deg, #e8d3a8 0%, #d9bf82 50%, #b99a5c 100%)`,
  ink:  `radial-gradient(120% 80% at 50% 15%, rgba(157,118,75,.35) 0%, rgba(157,118,75,0) 60%),
         linear-gradient(165deg, #3a2f22 0%, #2b2620 50%, #150f08 100%)`
};

function applyTweaks(){
  const root = document.documentElement;
  const hero = document.getElementById('hero');
  const wm = document.querySelector('.hero .watermark');

  hero.style.background = HERO_BGS[state.heroBg] || HERO_BGS.tan;
  wm.style.display = state.watermark ? '' : 'none';

  const widths = { narrow: '440px', medium: '520px', wide: '600px' };
  root.style.setProperty('--card-w', `clamp(340px, 92vw, ${widths[state.frameWidth] || '600px'})`);

  const r = state.cardShape === 'pill' ? '999px'
         : state.cardShape === 'sharp' ? '4px'
         : '14px';
  document.querySelectorAll('.card').forEach(c => c.style.borderRadius = r);
}

function wireTweaks(){
  const map = {
    'tw-bg': 'heroBg',
    'tw-width': 'frameWidth',
    'tw-shape': 'cardShape',
    'tw-watermark': 'watermark'
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if(el.type === 'checkbox') el.checked = !!state[key];
    else el.value = state[key];
    el.addEventListener('change', () => {
      const v = el.type === 'checkbox' ? el.checked : el.value;
      state[key] = v;
      applyTweaks();
      try { window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[key]: v}}, '*'); } catch(e){}
    });
  });
}

window.addEventListener('message', (e) => {
  if(!e.data || !e.data.type) return;
  if(e.data.type === '__activate_edit_mode')   document.getElementById('tweaks').classList.add('on');
  if(e.data.type === '__deactivate_edit_mode') document.getElementById('tweaks').classList.remove('on');
});

wireTweaks();
applyTweaks();
try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
