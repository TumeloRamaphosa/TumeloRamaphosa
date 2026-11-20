#!/usr/bin/env bash
# Install the Jarvis APK on a running emulator, launch it, and fail on a crash.
# Usage: bash smoke.sh path/to/app-release.apk out-dir
set -uo pipefail
APK="$1"; OUT="$2"; PKG=com.privateagent.private_agent
mkdir -p "$OUT"

adb wait-for-device
adb install -r "$APK" || { echo "install failed"; exit 1; }
adb logcat -c
adb shell am start -W -n "$PKG/.MainActivity"
sleep 30

PID="$(adb shell pidof "$PKG" | tr -d '\r')"
adb exec-out screencap -p > "$OUT/jarvis-screen.png"
adb logcat -d > "$OUT/logcat.txt"
grep -E "FATAL EXCEPTION|AndroidRuntime|$PKG" "$OUT/logcat.txt" | tail -40 > "$OUT/logcat-jarvis.txt" || true

if grep -q "FATAL EXCEPTION" "$OUT/logcat.txt" && grep -A3 "FATAL EXCEPTION" "$OUT/logcat.txt" | grep -q "$PKG"; then
  echo "Jarvis crashed:"; grep -A20 "FATAL EXCEPTION" "$OUT/logcat.txt" | head -40; exit 1
fi
if [ -z "$PID" ]; then
  echo "Jarvis is not running 30s after launch"; tail -60 "$OUT/logcat-jarvis.txt"; exit 1
fi
echo "Jarvis running (pid $PID), no crash in logcat"
