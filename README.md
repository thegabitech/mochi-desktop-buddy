# Mochi — Desktop Buddy 🐾

A small desktop companion cat you can publish for real. This is the **rebranded,
fully original, 100% offline** sibling of the `pusheen-app` fan project one
folder up — built specifically to be shareable without any IP concerns.

**v1.1.1:** fixed a real first-run bug where the widget's action buttons
(Feed/Pet/Dance/Play/Surprise) were permanently unclickable until the user
happened to cycle Nap → Wake once — `setButtons(false)` ran at startup with
nothing to ever re-enable it. Found via a from-scratch interactive
verification pass (`document.getElementById(...).disabled` checks against
the live app), not just code review — worth knowing if you're auditing
similar init-sequence code elsewhere in this project.

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

Three windows sharing one animation engine, controlled two ways: the system
tray (original) and now an **in-app modes panel** in the widget itself (the
🧩 button next to the close button) — click it to toggle Screen Walker and
Desk Buddy on/off without ever touching the tray. No more hunting for a
hidden icon; the widget is the hub.

- `mascot.js` + `mascot.css` — the shared engine. One SVG, driven entirely by
  CSS keyframes — **26 states**: `idle`, `walk`, `run`, `sit`, `sleep`,
  `tired`, `eat`, `play`, `dance`, `fly`, `wave`, `stretch`, `wink`, `dizzy`,
  `curious`, `shy`, `excited`, `bored`, `laugh`, `nuzzle`, `music`, `read`,
  `paint`, `cold`, `sunny`, `birthday`. No raster assets, nothing fetched
  over the network, ever.
  - **Gotcha this taught us:** a CSS `transform` (even via animation) fully
    *replaces* an SVG `transform="translate(...)"` attribute rather than
    composing with it. Every prop that needs both static positioning and its
    own animation uses a static outer `<g>` (attribute-positioned) wrapping
    an unpositioned inner `<g>` (CSS-animated) — see `mochi-bowl`/
    `mochi-bowl-inner` for the pattern. Skipping this is what caused the
    original "eating is laggy" bug (the chewing mouth and food bowl were
    animating around the wrong transform origin, making them visibly jitter).
- `widget.html` — the companion window: Feed / Pet / Dance / Play /
  **Surprise** (samples the newer expressive states) / Nap buttons, stats,
  auto-sleep, and the modes panel.
- `walker.html` — transparent full-screen overlay; Mochi roams through all
  26 states, flies on balloons, click-through everywhere except on her.
  **Drag her** to reposition; she resumes roaming from the new spot.
- `buddy.html` — small always-on-top window; Mochi sits and loafs through a
  calm subset of states, fully **draggable**, resizable by scroll wheel,
  remembers her spot across restarts.
- `main.js` / `preload.js` — Electron shell: system tray *and* in-widget
  modes panel (both drive the same `modes:get`/`modes:toggle` IPC, with
  live-broadcast so either UI stays in sync with the other), single-instance
  lock, IPC-driven window dragging (cursor-follow loop in the main process —
  smooth, DPI-proof), debounced settings persistence.
  - **Gotcha this taught us:** the widget window never had a `preload`
    script wired up in `webPreferences` (walker/buddy did). The original
    code always guarded every `window.pet` reference with a ternary
    fallback, so this was invisible — until the modes panel called
    `window.pet.getModes()` directly with no guard, which threw
    `TypeError: Cannot read properties of undefined` on page load and
    silently aborted the *entire* script before the Mochi sprite ever got
    constructed. That was the real cause of the "blank widget" bug — always
    give every `BrowserWindow` that talks to `window.pet` an explicit
    `webPreferences.preload`, even if nothing seems to need it yet.

## Run it

```
npm install
npm start              # companion widget
npm start -- --walker  # screen walker
npm start -- --buddy   # still buddy
```

Or use the packaged build in `release/win-unpacked/Mochi.exe` (no Node
required), or the installer `release/Mochi-Setup-1.0.0.exe`.

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

**Latest download:** https://github.com/thegabitech/mochi-desktop-buddy/releases/download/v1.0.0/Mochi-Setup-1.0.0.exe

To publish a new version: bump `version` in `package.json`, rebuild
(`npm run installer`), then
`gh release create vX.Y.Z release/Mochi-Setup-X.Y.Z.exe --title "Mochi vX.Y.Z" --notes "..."`.

None of the remaining items require more design or coding work on the app
itself — it's account setup, a paid certificate, and per-platform packaging,
which needs your own accounts/payment to complete.

## Files

- `mascot.js` / `mascot.css` — Mochi's shared animation engine
- `widget.html` / `walker.html` / `buddy.html` — the three modes
- `main.js` / `preload.js` — Electron app shell + tray
- `icon.png` / `icon-256.png` / `icon-art.html` — app icon (Mochi's face),
  source SVG in `icon-art.html`
- `package.json` — build config (electron-builder, Windows NSIS target)
