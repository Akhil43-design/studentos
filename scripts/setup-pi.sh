#!/bin/bash
# ==============================================================================
# StudentOS / SmartSlate — One-Click Raspberry Pi Zero 2 W Automated Setup
# Target OS: Raspberry Pi OS Lite (64-bit)
# ==============================================================================

set -e

echo "====================================================="
echo "🚀 Initializing StudentOS Raspberry Pi Zero 2 W Setup"
echo "====================================================="

# 1. Update Linux Package Lists
echo "[1/6] Updating system package repositories..."
sudo apt-get update -y

# 2. Install Required Dependencies (X11, Openbox, Chromium, Unclutter, Node.js tools)
echo "[2/6] Installing X11, Chromium Browser, Unclutter, and Utilities..."
sudo apt-get install -y \
    xserver-xorg \
    xinit \
    openbox \
    chromium-browser \
    unclutter \
    curl \
    git \
    build-essential \
    python3

# 3. Make Scripts Executable
echo "[3/6] Configuring script permissions..."
chmod +x /home/pi/notepad/scripts/kiosk.sh || chmod +x ./scripts/kiosk.sh

# 4. Install Node Dependencies & Build Production Frontend
echo "[4/6] Installing Node modules & compiling Vite frontend static assets..."
npm run install:all
npm run build:frontend

# 5. Initialize & Seed SQLite Database
echo "[5/6] Initializing SQLite database schema and seed data..."
npm run seed

# 6. Install & Register Systemd Auto-Boot Services
echo "[6/6] Registering Systemd Services (Auto-Boot Server & Kiosk)..."
sudo cp /home/pi/notepad/scripts/smartslate.service /etc/systemd/system/ || sudo cp ./scripts/smartslate.service /etc/systemd/system/
sudo cp /home/pi/notepad/scripts/smartslate-kiosk.service /etc/systemd/system/ || sudo cp ./scripts/smartslate-kiosk.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable smartslate.service
sudo systemctl enable smartslate-kiosk.service

sudo systemctl restart smartslate.service

echo "====================================================="
echo "✅ StudentOS Setup Completed Successfully!"
echo "🌐 Server running on http://localhost:5000"
echo "🖥️ Kiosk mode will start automatically on reboot."
echo "====================================================="
