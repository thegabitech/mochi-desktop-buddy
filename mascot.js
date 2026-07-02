// mascot.js — Mochi, an original animated desktop cat.
// Pure inline SVG + CSS keyframes (mascot.css). No raster images, no network
// calls, fully offline. Used by pet.html.

const MOCHI_SVG = `
<svg class="mochi-sprite" viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="mochi-shine" cx="35%" cy="25%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <g class="mochi-tail">
    <path d="M244 190 Q302 168 298 128 Q294 92 258 98 Q280 118 270 150 Q262 178 234 184 Z"
          fill="#eabd8e" stroke="#6b4a34" stroke-width="7" stroke-linejoin="round"/>
  </g>

  <g class="mochi-body-group">
    <g class="mochi-ear l">
      <path d="M94 98 Q82 44 128 66 Q117 92 108 106 Z" fill="#f7e8d6" stroke="#6b4a34" stroke-width="7" stroke-linejoin="round"/>
      <path d="M99 91 Q92 60 118 74 Q111 89 104 97 Z" fill="#f8cdd9"/>
    </g>
    <g class="mochi-ear r">
      <path d="M222 98 Q234 44 188 66 Q199 92 208 106 Z" fill="#f7e8d6" stroke="#6b4a34" stroke-width="7" stroke-linejoin="round"/>
      <path d="M217 91 Q224 60 198 74 Q205 89 212 97 Z" fill="#f8cdd9"/>
    </g>

    <ellipse cx="158" cy="178" rx="100" ry="90" fill="#f7e8d6" stroke="#6b4a34" stroke-width="7"/>
    <path d="M168 94 Q214 88 222 132 Q227 164 192 162 Q164 155 166 120 Z" fill="#eabd8e"/>
    <ellipse cx="230" cy="212" rx="27" ry="32" fill="#eabd8e"/>

    <!-- soft belly highlight + head shine, for a plush, rounded feel -->
    <ellipse cx="150" cy="212" rx="52" ry="46" fill="#fff8ee" opacity=".65"/>
    <ellipse cx="120" cy="110" rx="70" ry="46" fill="url(#mochi-shine)"/>

    <g class="mochi-leg l"><ellipse cx="122" cy="252" rx="27" ry="21" fill="#f7e8d6" stroke="#6b4a34" stroke-width="7"/></g>
    <g class="mochi-leg r"><ellipse cx="184" cy="256" rx="27" ry="21" fill="#f7e8d6" stroke="#6b4a34" stroke-width="7"/></g>

    <g stroke="#6b4a34" stroke-width="4" stroke-linecap="round">
      <line x1="86" y1="132" x2="50" y2="125"/>
      <line x1="86" y1="146" x2="50" y2="151"/>
      <line x1="230" y1="132" x2="266" y2="125"/>
      <line x1="230" y1="146" x2="266" y2="151"/>
    </g>

    <g class="mochi-eye-open l">
      <ellipse cx="110" cy="134" rx="14" ry="17" fill="#fff"/>
      <g class="mochi-pupil">
        <ellipse cx="112" cy="136" rx="9" ry="12" fill="#3f2f22"/>
        <ellipse cx="109" cy="130" rx="3" ry="4" fill="#fff" opacity=".95"/>
      </g>
    </g>
    <g class="mochi-eye-open r">
      <ellipse cx="168" cy="134" rx="14" ry="17" fill="#fff"/>
      <g class="mochi-pupil">
        <ellipse cx="170" cy="136" rx="9" ry="12" fill="#3f2f22"/>
        <ellipse cx="167" cy="130" rx="3" ry="4" fill="#fff" opacity=".95"/>
      </g>
    </g>
    <path class="mochi-eye-closed l" d="M98 135 q12 10 24 0" stroke="#3f2f22" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path class="mochi-eye-closed r" d="M156 135 q12 10 24 0" stroke="#3f2f22" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path class="mochi-eye-half l" d="M100 132 q10 6 20 0" stroke="#3f2f22" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path class="mochi-eye-half r" d="M158 132 q10 6 20 0" stroke="#3f2f22" stroke-width="4.5" stroke-linecap="round" fill="none"/>

    <path class="mochi-mouth-idle" d="M126 152 q6 8 12 0 q6 8 12 0" stroke="#3f2f22" stroke-width="5" stroke-linecap="round" fill="none"/>
    <ellipse class="mochi-mouth-eat" cx="139" cy="156" rx="9" ry="11" fill="#3f2f22"/>
    <ellipse class="mochi-mouth-laugh" cx="139" cy="156" rx="16" ry="13" fill="#3f2f22"/>
    <path class="mochi-mouth-laugh" d="M129 154 Q139 164 149 154" stroke="#f7e8d6" stroke-width="3" stroke-linecap="round" fill="none"/>

    <ellipse class="mochi-blush l" cx="96" cy="152" rx="13" ry="7.5" fill="#f4a5bc" opacity=".8"/>
    <ellipse class="mochi-blush r" cx="182" cy="152" rx="13" ry="7.5" fill="#f4a5bc" opacity=".8"/>
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
    <path d="M94 100 Q158 40 222 100" stroke="#6b4a34" stroke-width="8" fill="none" stroke-linecap="round"/>
    <ellipse cx="94" cy="112" rx="16" ry="20" fill="#f7b0c6" stroke="#6b4a34" stroke-width="4"/>
    <ellipse cx="222" cy="112" rx="16" ry="20" fill="#f7b0c6" stroke="#6b4a34" stroke-width="4"/>
    <text class="mochi-note" x="250" y="70" font-size="22" fill="#6b4a34">♪</text>
  </g>

  <g class="mochi-book" transform="translate(66,232)">
    <path d="M0 0 Q22 -10 44 0 L44 24 Q22 14 0 24 Z" fill="#a9d4ff" stroke="#6b4a34" stroke-width="3" stroke-linejoin="round"/>
    <path d="M44 0 Q66 -10 88 0 L88 24 Q66 14 44 24 Z" fill="#f7b0c6" stroke="#6b4a34" stroke-width="3" stroke-linejoin="round"/>
    <path class="mochi-page" d="M44 0 Q30 -8 16 -2 L16 20 Q30 14 44 22 Z" fill="#fff9ef" stroke="#6b4a34" stroke-width="2"/>
  </g>

  <g class="mochi-easel" transform="translate(40,190)">
    <path d="M4 74 L34 8 L64 74" stroke="#6b4a34" stroke-width="5" fill="none" stroke-linecap="round"/>
    <line x1="14" y1="52" x2="54" y2="52" stroke="#6b4a34" stroke-width="5" stroke-linecap="round"/>
    <rect x="10" y="16" width="48" height="38" rx="3" fill="#fff9ef" stroke="#6b4a34" stroke-width="4"/>
    <circle class="mochi-dab" cx="26" cy="32" r="6" fill="#f7b0c6"/>
    <circle class="mochi-dab" cx="42" cy="40" r="5" fill="#a9d4ff"/>
  </g>

  <g class="mochi-scarf" transform="translate(108,190)">
    <path d="M0 0 Q50 20 100 0 L100 16 Q50 36 0 16 Z" fill="#f7b0c6" stroke="#6b4a34" stroke-width="4" stroke-linejoin="round"/>
    <rect x="60" y="12" width="16" height="34" rx="4" fill="#f7b0c6" stroke="#6b4a34" stroke-width="4"/>
  </g>

  <g class="mochi-shades" transform="translate(158,188)">
    <rect x="-34" y="-11" width="26" height="20" rx="7" fill="#3f2f22" stroke="#3f2f22"/>
    <rect x="8" y="-11" width="26" height="20" rx="7" fill="#3f2f22" stroke="#3f2f22"/>
    <line x1="-8" y1="-4" x2="8" y2="-4" stroke="#3f2f22" stroke-width="3"/>
  </g>

  <g class="mochi-partyhat" transform="translate(158,44)">
    <path d="M-20 40 L0 -26 L20 40 Z" fill="#a9d4ff" stroke="#6b4a34" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="0" cy="-26" r="6" fill="#f7b0c6" stroke="#6b4a34" stroke-width="3"/>
    <circle cx="-8" cy="14" r="4" fill="#fff9ef"/><circle cx="6" cy="0" r="4" fill="#f7b0c6"/>
  </g>
  <g class="mochi-confetti">
    <text class="mochi-conf c1" x="70" y="70" font-size="16">🎉</text>
    <text class="mochi-conf c2" x="230" y="80" font-size="14">🎊</text>
    <text class="mochi-conf c3" x="150" y="50" font-size="15">✨</text>
  </g>

  <g class="mochi-balloons" transform="translate(158,60)">
    <line class="mochi-string b1" x1="-4" y1="18" x2="-30" y2="70" stroke="#6b4a34" stroke-width="2.5"/>
    <line class="mochi-string b2" x1="4" y1="18" x2="6" y2="72" stroke="#6b4a34" stroke-width="2.5"/>
    <line class="mochi-string b3" x1="12" y1="18" x2="34" y2="70" stroke="#6b4a34" stroke-width="2.5"/>
    <g class="mochi-balloon b1" data-balloon="b1"><ellipse cx="-30" cy="0" rx="24" ry="28" fill="#f7b0c6" stroke="#6b4a34" stroke-width="3"/></g>
    <g class="mochi-balloon b2" data-balloon="b2"><ellipse cx="6" cy="-16" rx="26" ry="30" fill="#a9d4ff" stroke="#6b4a34" stroke-width="3"/></g>
    <g class="mochi-balloon b3" data-balloon="b3"><ellipse cx="34" cy="0" rx="24" ry="28" fill="#c9f0c0" stroke="#6b4a34" stroke-width="3"/></g>
  </g>

  <g class="mochi-wings">
    <path class="mochi-wing l" d="M110 150 Q40 130 30 90 Q80 96 118 138 Z" fill="#fff" stroke="#6b4a34" stroke-width="6" stroke-linejoin="round"/>
    <path class="mochi-wing r" d="M206 150 Q276 130 286 90 Q236 96 198 138 Z" fill="#fff" stroke="#6b4a34" stroke-width="6" stroke-linejoin="round"/>
  </g>

  <g class="mochi-plane" transform="translate(158,232)">
    <path d="M-70 6 L60 6 L84 -8 L60 -6 L-70 -6 Z" fill="#a9d4ff" stroke="#6b4a34" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-20 -6 L4 -34 L20 -34 L4 -6 Z" fill="#f7e8d6" stroke="#6b4a34" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-30 6 L-14 26 L2 26 L-10 6 Z" fill="#f7e8d6" stroke="#6b4a34" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="46" cy="-1" r="5" fill="#fff"/>
  </g>

  <g class="mochi-pop-burst"></g>

  <g class="mochi-toy" transform="translate(46,236)">
    <g class="mochi-toy-inner">
      <circle r="16" fill="#f7b0c6" stroke="#6b4a34" stroke-width="3"/>
      <path d="M-11 -4 Q0 6 11 -4" stroke="#6b4a34" stroke-width="2" fill="none"/>
      <path d="M-9 4 Q0 12 9 4" stroke="#6b4a34" stroke-width="2" fill="none"/>
    </g>
  </g>

  <g class="mochi-bowl" transform="translate(118,238)">
    <g class="mochi-bowl-inner">
      <ellipse cx="40" cy="18" rx="34" ry="10" fill="#c98a4a"/>
      <path d="M6 18 Q6 40 40 40 Q74 40 74 18 Z" fill="#e8a35f" stroke="#6b4a34" stroke-width="3"/>
      <circle cx="30" cy="14" r="5" fill="#eabd8e"/><circle cx="46" cy="12" r="5" fill="#f7e8d6"/><circle cx="40" cy="20" r="5" fill="#eabd8e"/>
    </g>
  </g>

  <g class="mochi-zzz" fill="#6b4a34" font-family="Comic Sans MS, cursive" font-weight="700">
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
    // null (not 'idle'): setState()'s no-op guard compares against this, so
    // the very first setState('idle') call must not be silently skipped —
    // otherwise the class attribute never gets an explicit state suffix.
    this.state = null;
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

  // reset all 3 balloons to intact (call whenever entering the balloon state)
  resetBalloons() {
    this.container.querySelectorAll('.mochi-balloon, .mochi-string').forEach(el => el.classList.remove('popped'));
  }

  // pop one balloon by id ('b1'|'b2'|'b3'); returns how many remain intact
  popBalloon(id) {
    const balloon = this.container.querySelector('.mochi-balloon.' + id);
    const string = this.container.querySelector('.mochi-string.' + id);
    if (balloon && !balloon.classList.contains('popped')) {
      const pt = balloon.querySelector('ellipse');
      const burst = this.container.querySelector('.mochi-pop-burst');
      if (pt && burst) {
        const cx = pt.getAttribute('cx'), cy = pt.getAttribute('cy');
        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', cx); txt.setAttribute('y', cy);
        txt.setAttribute('font-size', '26'); txt.setAttribute('text-anchor', 'middle');
        txt.textContent = '💥';
        const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        wrap.setAttribute('transform', 'translate(158,60)');
        wrap.appendChild(txt);
        burst.appendChild(wrap);
        setTimeout(() => wrap.remove(), 550);
      }
      balloon.classList.add('popped');
      if (string) string.classList.add('popped');
    }
    return this.container.querySelectorAll('.mochi-balloon:not(.popped)').length;
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
