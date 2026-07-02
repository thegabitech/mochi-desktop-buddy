# context-check.ps1 -- one-shot check of "what is the user doing right now"
# Outputs JSON: { "context": "paint" | "music" | null, "detail": "<process or track>" }
# Used by main.js (polled every few seconds) to make Mochi react to painting
# apps or currently-playing music. No data leaves the machine.

$ErrorActionPreference = 'SilentlyContinue'

Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class FgWin {
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
}
'@

$paintApps = @(
  'mspaint','photoshop','gimp-2.10','gimp','krita','paintdotnet',
  'corelphotopaint','artrage','medibangpaintpro','clipstudiopaint',
  'sai2','sai','paintshoppro','affinityphoto','procreate'
)

$result = @{ context = $null; detail = $null }

# 1) foreground app = painting app?
try {
  $hwnd = [FgWin]::GetForegroundWindow()
  $fgPid = 0
  [FgWin]::GetWindowThreadProcessId($hwnd, [ref]$fgPid) | Out-Null
  if ($fgPid -gt 0) {
    $proc = Get-Process -Id $fgPid -ErrorAction Stop
    $name = $proc.ProcessName.ToLower()
    if ($paintApps -contains $name) {
      $result.context = 'paint'
      $result.detail = $proc.ProcessName
    }
  }
} catch {}

# 2) not painting? check system-wide "now playing" media session (the same
#    info source behind the volume-flyout / media-key overlay -- picks up
#    Spotify, browser tabs, Windows Media Player, etc.)
if (-not $result.context) {
  try {
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    $asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() |
      Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
    function Await-WinRT($WinRtTask, $ResultType) {
      $m = $asTaskGeneric.MakeGenericMethod($ResultType)
      $netTask = $m.Invoke($null, @($WinRtTask))
      $netTask.Wait(2000) | Out-Null
      $netTask.Result
    }
    [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager,Windows.Media.Control,ContentType=WindowsRuntime] | Out-Null
    $mgrType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]
    $mgr = Await-WinRT ($mgrType::RequestAsync()) $mgrType
    $session = $mgr.GetCurrentSession()
    if ($session) {
      $info = $session.GetPlaybackInfo()
      # PlaybackStatus enum: Closed=0 Opened=1 Changing=2 Stopped=3 Playing=4 Paused=5
      if ($info.PlaybackStatus -eq 4) {
        $result.context = 'music'
        try {
          $propType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSession]
          $propsAsync = $session.TryGetMediaPropertiesAsync()
          $props = Await-WinRT $propsAsync ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])
          $result.detail = "$($props.Artist) - $($props.Title)"
        } catch { $result.detail = 'now playing' }
      }
    }
  } catch {}
}

$result | ConvertTo-Json -Compress
