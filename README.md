# Mochi — Desktop Buddy 🐾

A small desktop companion cat you can publish for real. This is the **rebranded,
fully original, 100% offline** sibling of the `pusheen-app` fan project one
folder up — built specifically to be shareable without any IP concerns.

**v1.2.0:** simplified down to one window and one experience. The app now
opens straight into **Walking** mode (no separate widget/tray dance needed
to see her), with a small **☰ burger menu** on the overlay itself to switch
to **Standing** (she stays put, still fully draggable). The whole
tamagotchi-style companion widget — Feed/Pet/Dance/Play/Nap buttons, stats,
and the eating/sleeping mechanic — has been removed; this is now purely a
"cat that walks or stands on your screen and does tricks" app, not a virtual
pet with hunger/sleep timers. `eat`/`sleep`/`tired`/`bed` are no longer in
either behavior pool.

## What changed vs. the Pusheen version

| | Pusheen fan app (`../`) | Mochi (this folder) |
|---|---|---|
| Character | Pusheen (Pusheen Corp. IP) | **Mochi** — original design, drawn from scratch |
| Animations | Official GIFs hotlinked from GIPHY | **Pure SVG + CSS**, drawn and animated locally |
| Internet required | Yes (streams GIFs) | **No — fully offline**, zero network calls |
| Distribution | Private only (friends, no store) | **Publishable** — free of third-party trademark/copyright |

Mochi's design is deliberately distinct from Pusheen at every visual level:
cream body with caramel *calico patches* (not vertical head stripes), simple
rounded ears (no notched inner-ear pattern), a solid fluffy tail (not
horizontally banded), and taller egg-shaped proportions. Nothing here was
copied, traced, or minimally-altered from any existing character — it's an
original design made for this app.

## Architecture

**One window, one animation engine, one on-screen menu.** Mochi lives on a
single transparent, click-through-everywhere-except-on-her, full-screen
overlay. She opens in Walking mode by default; click the **☰** in the
corner to switch to Standing. No tray-hunting, no separate companion window.

- `mascot.js` + `mascot.css` — the shared engine. One SVG, driven entirely by
  CSS keyframes — **26 states** defined: `idle`, `walk`, `run`, `sit`,
  `sleep`, `tired`, `eat`, `play`, `dance`, `fly`, `wave`, `stretch`, `wink`,
  `dizzy`, `curious`, `shy`, `excited`, `bored`, `laugh`, `nuzzle`, `music`,
  `read`, `paint`, `cold`, `sunny`, `birthday` — though `pet.html` only ever
  *uses* 24 of them: `eat`/`sleep`/`tired`/`bed` are excluded from both
  behavior pools (no more virtual-pet hunger/sleep mechanic). No raster
  assets, nothing fetched over the network, ever.
  - **Gotcha this taught us:** a CSS `transform` (even via animation) fully
    *replaces* an SVG `transform="translate(...)"` attribute rather than
    composing with it. Every prop that needs both static positioning and its
    own animation uses a static outer `<g>` (attribute-positioned) wrapping
    an unpositioned inner `<g>` (CSS-animated) — see `mochi-bowl`/
    `mochi-bowl-inner` for the pattern.
- `pet.html` — the whole app. Two behavior modes sharing one movement loop
  and one drag mechanism:
  - **Walking** (default) — roams the screen, ~74% chance of movement
    (walk/run/fly) vs. static tricks each time she picks something new.
  - **Standing** — parks in place, cycling calm poses only.
  - Click her for a new trick in either mode. **Drag her** anywhere — since
    the window already covers the whole screen, "dragging" just moves her
    on-page position, no OS window movement needed (this is why Standing no
    longer needs its own small window like the old `buddy.html` did).
  - Scroll to resize. Right-click, or the menu's Quit, to close.
- `main.js` / `preload.js` — Electron shell: single-instance lock, one
  `BrowserWindow`, a minimal system tray (show/hide, start-with-Windows,
  quit) as a backup control, debounced settings persistence (remembers mode
  + size across restarts).
  - **Gotcha this taught us (from the older 3-window version, still worth
    knowing):** every `BrowserWindow` that talks to `window.pet` needs an
    explicit `webPreferences.preload` — one window went without it for a
    while, and an unguarded `window.pet.X()` call threw on load and silently
    aborted the whole page script before anything rendered.

## Run it

```
npm install
npm start   # opens straight into Walking mode
```

Or use the packaged build in `release/win-unpacked/Mochi.exe` (no Node
required), or the installer `release/Mochi-Setup-<version>.exe`.

## Build

```
npm run package     # unpacked app -> release/win-unpacked
npm run installer   # NSIS installer -> release/Mochi-Setup-<version>.exe
```

If `npm run installer` fails with a `winCodeSign` symlink error, that's a
known electron-builder-on-Windows quirk (it tries to fetch macOS
code-signing tooling even for a Windows-only build). Fix: delete
`%LOCALAPPDATA%\electron-builder\Cache\winCodeSign` and retry — this is
already worked around by omitting a `mac` build target from `package.json`
and setting `signAndEditExecutable: false`.

## Publishing status — what's actually done vs. what's still needed

**Done, right now:**
- Zero third-party copyrighted/trademarked content — safe to distribute
  publicly under your own name/brand.
- Fully offline — no server, no API keys, no data collection.
- Clean, buildable Windows installer.

**Still needed before an actual store listing:**

- **Microsoft Store — two real paths:**
  1. **MSIX/APPX** (native Store package): `npm run msix` is wired up
     (`electron-builder --win appx`), but building it locally requires the
     **Windows 10/11 SDK** (`makeappx.exe`/`makepri.exe`), which isn't
     installed on this machine — unlike NSIS, electron-builder does not
     auto-download these. Install the SDK (or the lighter
     `Microsoft.Windows.SDK.BuildTools` NuGet package, untested with
     electron-builder) to unblock this, then update the placeholder
     `identityName`/`publisher` values in `package.json`'s `appx` block with
     the real values Partner Center gives you after reserving the app name.
  2. **Unpackaged EXE submission** (what we're set up for): Microsoft has
     accepted plain Win32 installers directly since ~2020 — no MSIX needed.
     Confirmed requirements ([Microsoft Learn](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msi/app-package-requirements)):
     - **The installer must be Authenticode-signed** with a real code-signing
       certificate before submission. *Not done yet* — cheapest legitimate
       option is [Azure Trusted Signing](https://learn.microsoft.com/azure/trusted-signing/overview)
       (~$10/month); wire it into `electron-builder`'s `win.certificateFile`/
       signing hook once you have an account.
     - **Silent install** — confirmed working: `Mochi-Setup-1.0.0.exe /S`
       installs with zero UI.
     - **You host the installer yourself** at a stable, versioned HTTPS URL
       (Microsoft links to it, doesn't take an upload). Set up as a GitHub
       Release — see below.
  - Either path also needs the one-time (~$19) Partner Center individual
    developer account.
- **Apple App Store (macOS)**: Electron *can* target macOS
  (`electron-builder --mac`), but shipping to the Mac App Store needs (a) a
  Mac to build/test on, (b) an Apple Developer Program membership ($99/yr),
  (c) code signing with an Apple Developer ID, and (d) notarization. None of
  that can be done from this Windows machine without those credentials.
- **iOS App Store**: not possible with this codebase at all — Electron
  doesn't run on iOS. A "Mochi for iPhone" would be a from-scratch
  SwiftUI/React Native rewrite, not a port.
- Pick a final app name/icon if "Mochi" collides with something already on
  a store (a quick search before submitting is worth doing).

## Public download / releases

**Repo:** https://github.com/thegabitech/mochi-desktop-buddy

The installer is published on GitHub Releases so it has a stable, versioned
URL — useful for sharing right now, and exactly what Microsoft's unpackaged
EXE submission requires later:

**Latest download:** see the [Releases page](https://github.com/thegabitech/mochi-desktop-buddy/releases/latest)
for the current `Mochi-Setup-<version>.exe`.

To publish a new version: bump `version` in `package.json`, rebuild
(`npm run installer`), then
`gh release create vX.Y.Z release/Mochi-Setup-X.Y.Z.exe --title "Mochi vX.Y.Z" --notes "..."`.

None of the remaining items require more design or coding work on the app
itself — it's account setup, a paid certificate, and per-platform packaging,
which needs your own accounts/payment to complete.

## Files

- `mascot.js` / `mascot.css` — Mochi's shared animation engine
- `pet.html` — the whole app: Walking/Standing modes, burger menu, drag,
  resize, click-through
- `main.js` / `preload.js` — Electron app shell + tray
- `icon.png` / `icon-256.png` / `icon-art.html` — app icon (Mochi's face),
  source SVG in `icon-art.html`
- `package.json` — build config (electron-builder, Windows NSIS target)
