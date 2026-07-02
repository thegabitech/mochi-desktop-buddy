// mascot.js — Mochi, an original animated desktop cat.
// Pure inline SVG + CSS keyframes (mascot.css). No raster images, no network
// calls, fully offline. Used identically by widget.html / walker.html / buddy.html.

const MOCHI_SVG = `
<svg class="mochi-sprite" viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg">
  <g class="mochi-tail">
    <path d="M244 190 Q300 170 296 130 Q292 96 260 100 Q280 120 270 150 Q262 176 236 182 Z"
          fill="#e8b98a" stroke="#8a6a4a" stroke-width="6" stroke-linejoin="round"/>
  </g>

  <g class="mochi-body-group">
    <g class="mochi-ear l">
      <path d="M96 96 Q86 46 128 66 Q118 90 110 104 Z" fill="#f5e6d3" stroke="#8a6a4a" stroke-width="6" stroke-linejoin="round"/>
      <path d="M100 90 Q94 60 118 72 Q112 86 106 96 Z" fill="#f6c9d8"/>
    </g>
    <g class="mochi-ear r">
      <path d="M220 96 Q230 46 188 66 Q198 90 206 104 Z" fill="#f5e6d3" stroke="#8a6a4a" stroke-width="6" stroke-linejoin="round"/>
      <path d="M216 90 Q222 60 198 72 Q204 86 210 96 Z" fill="#f6c9d8"/>
    </g>

    <ellipse cx="158" cy="176" rx="98" ry="88" fill="#f5e6d3" stroke="#8a6a4a" stroke-width="6"/>
    <path d="M170 96 Q210 92 216 130 Q220 158 190 156 Q166 150 168 122 Z" fill="#e8b98a"/>
    <ellipse cx="228" cy="210" rx="26" ry="30" fill="#e8b98a"/>

    <g class="mochi-leg l"><ellipse cx="122" cy="252" rx="26" ry="20" fill="#f5e6d3" stroke="#8a6a4a" stroke-width="6"/></g>
    <g class="mochi-leg r"><ellipse cx="182" cy="256" rx="26" ry="20" fill="#f5e6d3" stroke="#8a6a4a" stroke-width="6"/></g>

    <g stroke="#8a6a4a" stroke-width="3.5" stroke-linecap="round">
      <line x1="86" y1="188" x2="48" y2="180"/>
      <line x1="86" y1="200" x2="48" y2="204"/>
      <line x1="230" y1="188" x2="268" y2="180"/>
      <line x1="230" y1="200" x2="268" y2="204"/>
    </g>

    <ellipse class="mochi-eye-open l" cx="128" cy="188" rx="10" ry="12.5" fill="#4a3a2c"/>
    <ellipse class="mochi-eye-open r" cx="188" cy="188" rx="10" ry="12.5" fill="#4a3a2c"/>
    <path class="mochi-eye-closed l" d="M116 189 q12 10 24 0" stroke="#4a3a2c" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path class="mochi-eye-closed r" d="M176 189 q12 10 24 0" stroke="#4a3a2c" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path class="mochi-eye-half l" d="M118 186 q10 6 20 0" stroke="#4a3a2c" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path class="mochi-eye-half r" d="M178 186 q10 6 20 0" stroke="#4a3a2c" stroke-width="4" stroke-linecap="round" fill="none"/>

    <path class="mochi-mouth-idle" d="M150 208 Q158 218 166 208" stroke="#4a3a2c" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <ellipse class="mochi-mouth-eat" cx="158" cy="212" rx="9" ry="11" fill="#4a3a2c"/>
    <ellipse class="mochi-mouth-laugh" cx="158" cy="212" rx="16" ry="13" fill="#4a3a2c"/>
    <path class="mochi-mouth-laugh" d="M148 210 Q158 220 168 210" stroke="#f5e6d3" stroke-width="3" stroke-linecap="round" fill="none"/>

    <ellipse class="mochi-blush l" cx="108" cy="214" rx="13" ry="8" fill="#f6a8bc" opacity=".8"/>
    <ellipse class="mochi-blush r" cx="208" cy="214" rx="13" ry="8" fill="#f6a8bc" opacity=".8"/>
  </g>

  <g class="mochi-stars" transform="translate(158,60)">
    <g class="mochi-stars-spin">
      <text class="mochi-star s1" x="-40" y="10" font-size="20">✨</text>
      <text class="mochi-star s2" x="30" y="-10" font-size="16">⭐</text>
      <text class="mochi-star s3" x="-10" y="-30" font-size="14">✨</text>
    </g>
  </g>

  <g class="mochi-sparkles" transform="translate(158,150)">
    <text class="mochi-spark p1" x="-90" y="-20" font-size="20">✨</text>
    <text class="mochi-spark p2" x="80" y="-30" font-size="18">✨</text>
    <text class="mochi-spark p3" x="-70" y="40" font-size="16">✨</text>
    <text class="mochi-spark p4" x="85" y="30" font-size="18">✨</text>
  </g>

  <g class="mochi-headphones">
    <path d="M94 100 Q158 40 222 100" stroke="#8a6a4a" stroke-width="8" fill="none" stroke-linecap="round"/>
    <ellipse cx="94" cy="112" rx="16" ry="20" fill="#f7b0c6" stroke="#8a6a4a" stroke-width="4"/>
    <ellipse cx="222" cy="112" rx="16" ry="20" fill="#f7b0c6" stroke="#8a6a4a" stroke-width="4"/>
    <text class="mochi-note" x="250" y="70" font-size="22" fill="#8a6a4a">♪</text>
  </g>

  <g class="mochi-book" transform="translate(66,232)">
    <path d="M0 0 Q22 -10 44 0 L44 24 Q22 14 0 24 Z" fill="#a9d4ff" stroke="#8a6a4a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M44 0 Q66 -10 88 0 L88 24 Q66 14 44 24 Z" fill="#f7b0c6" stroke="#8a6a4a" stroke-width="3" stroke-linejoin="round"/>
    <path class="mochi-page" d="M44 0 Q30 -8 16 -2 L16 20 Q30 14 44 22 Z" fill="#fff9ef" stroke="#8a6a4a" stroke-width="2"/>
  </g>

  <g class="mochi-easel" transform="translate(40,190)">
    <path d="M4 74 L34 8 L64 74" stroke="#8a6a4a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <line x1="14" y1="52" x2="54" y2="52" stroke="#8a6a4a" stroke-width="5" stroke-linecap="round"/>
    <rect x="10" y="16" width="48" height="38" rx="3" fill="#fff9ef" stroke="#8a6a4a" stroke-width="4"/>
    <circle class="mochi-dab" cx="26" cy="32" r="6" fill="#f7b0c6"/>
    <circle class="mochi-dab" cx="42" cy="40" r="5" fill="#a9d4ff"/>
  </g>

  <g class="mochi-scarf" transform="translate(108,190)">
    <path d="M0 0 Q50 20 100 0 L100 16 Q50 36 0 16 Z" fill="#f7b0c6" stroke="#8a6a4a" stroke-width="4" stroke-linejoin="round"/>
    <rect x="60" y="12" width="16" height="34" rx="4" fill="#f7b0c6" stroke="#8a6a4a" stroke-width="4"/>
  </g>

  <g class="mochi-shades" transform="translate(158,188)">
    <rect x="-34" y="-11" width="26" height="20" rx="7" fill="#4a3a2c" stroke="#4a3a2c"/>
    <rect x="8" y="-11" width="26" height="20" rx="7" fill="#4a3a2c" stroke="#4a3a2c"/>
    <line x1="-8" y1="-4" x2="8" y2="-4" stroke="#4a3a2c" stroke-width="3"/>
  </g>

  <g class="mochi-partyhat" transform="translate(158,44)">
    <path d="M-20 40 L0 -26 L20 40 Z" fill="#a9d4ff" stroke="#8a6a4a" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="0" cy="-26" r="6" fill="#f7b0c6" stroke="#8a6a4a" stroke-width="3"/>
    <circle cx="-8" cy="14" r="4" fill="#fff9ef"/><circle cx="6" cy="0" r="4" fill="#f7b0c6"/>
  </g>
  <g class="mochi-confetti">
    <text class="mochi-conf c1" x="70" y="70" font-size="16">🎉</text>
    <text class="mochi-conf c2" x="230" y="80" font-size="14">🎊</text>
    <text class="mochi-conf c3" x="150" y="50" font-size="15">✨</text>
  </g>

  <g class="mochi-balloons" transform="translate(158,60)">
    <line x1="-4" y1="18" x2="-30" y2="70" stroke="#8a6a4a" stroke-width="2.5"/>
    <line x1="4" y1="18" x2="6" y2="72" stroke="#8a6a4a" stroke-width="2.5"/>
    <line x1="12" y1="18" x2="34" y2="70" stroke="#8a6a4a" stroke-width="2.5"/>
    <g class="mochi-balloon b1"><ellipse cx="-30" cy="0" rx="20" ry="24" fill="#f7b0c6" stroke="#8a6a4a" stroke-width="3"/></g>
    <g class="mochi-balloon b2"><ellipse cx="6" cy="-16" rx="22" ry="26" fill="#a9d4ff" stroke="#8a6a4a" stroke-width="3"/></g>
    <g class="mochi-balloon b3"><ellipse cx="34" cy="0" rx="20" ry="24" fill="#c9f0c0" stroke="#8a6a4a" stroke-width="3"/></g>
  </g>

  <g class="mochi-toy" transform="translate(46,236)">
    <g class="mochi-toy-inner">
      <circle r="16" fill="#f7b0c6" stroke="#8a6a4a" stroke-width="3"/>
      <path d="M-11 -4 Q0 6 11 -4" stroke="#8a6a4a" stroke-width="2" fill="none"/>
      <path d="M-9 4 Q0 12 9 4" stroke="#8a6a4a" stroke-width="2" fill="none"/>
    </g>
  </g>

  <g class="mochi-bowl" transform="translate(118,238)">
    <g class="mochi-bowl-inner">
      <ellipse cx="40" cy="18" rx="34" ry="10" fill="#c98a4a"/>
      <path d="M6 18 Q6 40 40 40 Q74 40 74 18 Z" fill="#e8a35f" stroke="#8a6a4a" stroke-width="3"/>
      <circle cx="30" cy="14" r="5" fill="#e8b98a"/><circle cx="46" cy="12" r="5" fill="#f5e6d3"/><circle cx="40" cy="20" r="5" fill="#e8b98a"/>
    </g>
  </g>

  <g class="mochi-zzz" fill="#8a6a4a" font-family="Comic Sans MS, cursive" font-weight="700">
    <text class="z1" x="212" y="118" font-size="20">z</text>
    <text class="z2" x="226" y="102" font-size="16">z</text>
    <text class="z3" x="238" y="88" font-size="12">z</text>
  </g>
</svg>`;

class MochiSprite {
  constructor(container, opts = {}) {
    this.container = container;
    container.innerHTML = MOCHI_SVG;
    this.el = container.querySelector('.mochi-sprite');
    this.state = 'idle';
    this.dir = 1;
    this._twitchTimer = null;
    this.setSize(opts.size || 132);
    this._scheduleTwitch();
  }

  setState(name) {
    // NOTE: SVGElement.className is read-only (SVGAnimatedString), so we
    // always drive classes via setAttribute/classList, never `.className =`.
    if (this.state === name) return;
    this.state = name;
    this.el.setAttribute('class', 'mochi-sprite' + (this.dir === -1 ? ' flip' : '') + ' ' + name);
  }

  setDirection(dir) {
    this.dir = dir;
    this.el.classList.toggle('flip', dir === -1);
  }

  setSize(px) {
    this.size = px;
    this.el.style.height = px + 'px';
    this.el.style.width = (px * (320 / 280)) + 'px';
  }

  // one-off squish + heart pop, then returns to whatever state it was in
  pet(spawnFn) {
    this.el.classList.add('squish');
    setTimeout(() => this.el.classList.remove('squish'), 380);
    if (spawnFn) spawnFn();
  }

  _scheduleTwitch() {
    clearTimeout(this._twitchTimer);
    this._twitchTimer = setTimeout(() => {
      if (this.state !== 'sleep') {
        const ear = this.container.querySelector(Math.random() < 0.5 ? '.mochi-ear.l' : '.mochi-ear.r');
        if (ear) { ear.classList.add('twitch'); setTimeout(() => ear.classList.remove('twitch'), 550); }
      }
      this._scheduleTwitch();
    }, 6000 + Math.random() * 9000);
  }

  destroy() { clearTimeout(this._twitchTimer); }
}

// ---- shared floating-particle helper (hearts/sparkles), used by all pages ----
function mochiSpawnParticle(hostEl, emoji, x, y) {
  const el = document.createElement('div');
  el.className = 'mochi-float-particle';
  el.textContent = emoji;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  hostEl.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}
