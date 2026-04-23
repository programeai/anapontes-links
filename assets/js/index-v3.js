  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "heroBg": "tan",
    "heroRatio": "16/9",
    "cardShape": "soft",
    "watermark": true
  }/*EDITMODE-END*/;

  const state = { ...TWEAK_DEFAULTS };

  const BGS = {
    tan: `radial-gradient(120% 80% at 50% 8%, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 55%),
          radial-gradient(90% 65% at 50% 115%, rgba(129,90,46,.28) 0%, rgba(129,90,46,0) 60%),
          linear-gradient(165deg, #eed4b3 0%, #e1c9aa 45%, #c9a87e 100%)`,
    warm: `radial-gradient(120% 80% at 50% 8%, rgba(255,255,255,.5) 0%, rgba(255,255,255,0) 60%),
           linear-gradient(165deg, #fcf5ed 0%, #f7eadc 50%, #ead6bb 100%)`,
    gold: `radial-gradient(120% 80% at 50% 8%, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 55%),
           linear-gradient(165deg, #e8d3a8 0%, #d9bf82 50%, #b99a5c 100%)`,
    ink:  `radial-gradient(120% 80% at 50% 12%, rgba(157,118,75,.35) 0%, rgba(157,118,75,0) 60%),
           linear-gradient(165deg, #3a2f22 0%, #2b2620 50%, #150f08 100%)`
  };

  function applyTweaks(){
    const hero = document.getElementById('hero');
    hero.style.background = BGS[state.heroBg] || BGS.tan;

    hero.style.aspectRatio = state.heroRatio;

    document.querySelectorAll('.watermark').forEach(w => w.style.display = state.watermark ? '' : 'none');

    const r = state.cardShape === 'pill' ? '999px'
           : state.cardShape === 'sharp' ? '4px'
           : '16px';
    document.querySelectorAll('.card').forEach(c => c.style.borderRadius = r);
  }

  function wireTweaks(){
    const map = { 'tw-bg':'heroBg', 'tw-ratio':'heroRatio', 'tw-shape':'cardShape', 'tw-watermark':'watermark' };
    Object.entries(map).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if(el.type === 'checkbox') el.checked = !!state[key]; else el.value = state[key];
      el.addEventListener('change', () => {
        const v = el.type === 'checkbox' ? el.checked : el.value;
        state[key] = v;
        applyTweaks();
        try { window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[key]: v}}, '*'); } catch(e){}
      });
    });
  }

  function syncAboutFigureHeight(){
    const fig = document.querySelector('.about-figure');
    const body = document.querySelector('.about-body');
    if(!fig || !body) return;

    if(window.matchMedia('(max-width: 860px)').matches){
      fig.style.height = '';
      return;
    }

    fig.style.height = `${body.offsetHeight}px`;
  }

  window.addEventListener('message', (e) => {
    if(!e.data || !e.data.type) return;
    if(e.data.type === '__activate_edit_mode')   document.getElementById('tweaks').classList.add('on');
    if(e.data.type === '__deactivate_edit_mode') document.getElementById('tweaks').classList.remove('on');
  });

  window.addEventListener('resize', syncAboutFigureHeight);
  window.addEventListener('load', syncAboutFigureHeight);

  wireTweaks();
  applyTweaks();
  syncAboutFigureHeight();
  try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
