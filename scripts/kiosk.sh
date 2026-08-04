#!/bin/bash
# StudentOS / SmartSlate Kiosk Mode Launcher Script for Raspberry Pi OS Lite
# Disables screen sleep, hides mouse cursor, and starts Chromium in touch kiosk mode.

export DISPLAY=:0

# Disable screen blanking, power saving, and screensaver
xset s off
xset s noblank
xset -dpms

# Hide mouse cursor when inactive for 0.5s
unclutter -idle 0.5 -root &

# Wait for Node.js server to be responsive on port 5000
echo "[Kiosk] Waiting for StudentOS server at http://localhost:5000..."
until curl -s http://localhost:5000/api/health > /dev/null; do
    sleep 1
done
echo "[Kiosk] Server detected! Launching Chromium Kiosk..."

# Run Chromium browser in full-screen touch kiosk mode
chromium-browser \
    --noerrdialogs \
    --disable-infobars \
    --kiosk http://localhost:5000 \
    --touch-events=enabled \
    --disable-translate \
    --disable-features=TranslateUI \
    --check-for-update-interval=31536000 \
    --disable-pinch \
    --fast \
    --fast-start \
    --ignore-certificate-errors
