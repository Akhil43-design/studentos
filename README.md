# 🚀 StudentOS / SmartSlate – Offline-First Digital Notebook & LMS

**StudentOS (SmartSlate)** is a production-ready, modern, responsive full-stack web application designed for students, teachers, parents, and administrators. It acts as an offline-first digital notebook and learning management system (LMS) with touch/stylus handwriting capabilities, storing data locally via IndexedDB (Dexie.js) and synchronizing seamlessly with a local Node.js + Express + SQLite backend.

Targeted for **Raspberry Pi Zero 2 W** running **Raspberry Pi OS Lite (64-bit)** in Chromium Kiosk mode as well as desktop and mobile browsers.

---

## 🌟 Key Features

1. **Offline-First Architecture (PWA):**
   - Operations work 100% offline without internet.
   - IndexedDB local storage powered by **Dexie.js**.
   - Automatic background sync engine with conflict resolution (*latest modification wins*).
   - Real-time online/offline indicator badge & Socket.IO updates.

2. **Role-Based Dashboards & Workflows:**
   - **Student Dashboard:** Today's timetable, attendance progress gauge, recent notes, assignments, active exam launcher.
   - **Teacher Dashboard:** Class student lookup, attendance marking & history, assignment publisher & evaluator, exam marks entry.
   - **Parent Dashboard:** Child attendance gauge, exam mark breakdown, homework status, teacher communications.
   - **Administrator Dashboard:** User provisioning, SQLite database diagnostics, Raspberry Pi hardware monitor.

3. **HTML5 Canvas Drawing Studio:**
   - Touch, stylus pressure, and mouse support.
   - Tools: Pen, Highlighter, Marker, Brush, Shapes (Line, Rectangle, Circle), Eraser.
   - History: Multi-step Undo/Redo.
   - Backgrounds: Grid, Ruled Lines, Dots, Blank.
   - Export: PNG image & PDF document.

4. **Rich Text Notebook Editor:**
   - Formatting: Bold, Italic, Underline, Highlight.
   - Lists, Tables, Voice Note simulation, Math formula helper.
   - Tags, Folders, Favorites toggle, Instant Search, Sorting.

5. **Raspberry Pi Zero 2 W & OS Lite Compatibility:**
   - SQLite WAL (Write-Ahead Logging) and SD card optimizations.
   - Express single-process production server (`--max-old-space-size=128`).
   - One-click setup script (`scripts/setup-pi.sh`) and systemd services (`smartslate.service`, `smartslate-kiosk.service`).
   - Chromium Touch Kiosk launcher (`scripts/kiosk.sh`).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v3, React Router v6, Dexie.js (IndexedDB), Axios, Socket.IO Client, Recharts, jsPDF, html2canvas |
| **Backend** | Node.js, Express.js, SQLite (`sqlite3` + `sqlite`), JWT Auth, bcryptjs, Multer, Socket.IO, Helmet, CORS, Rate limiting |
| **PWA & Offline** | Web Service Worker, PWA Manifest, Sync Queue |
| **Hardware Compatibility** | Windows Laptop, Linux Desktop, Raspberry Pi 4, Raspberry Pi Zero 2 W (Lite OS) |

---

## 🔑 Demo Credentials

| Role | Username | 4-Digit PIN | Password |
|---|---|---|---|
| **Student** | `student` | `1234` | `student123` |
| **Teacher** | `teacher` | `1234` | `teacher123` |
| **Parent** | `parent` | `1234` | `parent123` |
| **Admin** | `admin` | `1234` | `admin123` |

---

## 🚀 Quick Start Guide (Windows / Mac / Linux)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Setup & Database Seeding

```bash
# Clone repository
git clone https://github.com/Akhil43-design/studentos.git
cd studentos

# Install dependencies for both Backend & Frontend
npm run install:all

# Seed initial SQLite Database with sample data
npm run seed
```

### 3. Running Dev Server

```bash
# Start Backend Server (http://localhost:5000)
npm run dev:backend

# Start Frontend Vite Dev Server (http://localhost:3000)
npm run dev:frontend
```

---

## 🍓 Raspberry Pi Zero 2 W Deployment (Raspberry Pi OS Lite 64-bit)

Execute the automated one-click installation script:
```bash
chmod +x ./scripts/setup-pi.sh
./scripts/setup-pi.sh
```

---

## 📄 License
MIT License - Designed and engineered for StudentOS Educational Environment.
