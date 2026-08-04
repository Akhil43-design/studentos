const fs = require('fs');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const drawingRoutes = require('./routes/drawingRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const examRoutes = require('./routes/examRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const syncRoutes = require('./routes/syncRoutes');
const reportRoutes = require('./routes/reportRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO for real-time synchronization updates
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Allows inline images and canvas data URLs
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve compiled Vite frontend static files (Raspberry Pi Single-Process Mode)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
}

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'StudentOS Raspberry Pi Backend',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/drawings', drawingRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);

// SPA Fallback: Serve index.html for non-API routes when frontend dist exists
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
    }
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.send('StudentOS Pi Server Running. Run "npm run build:frontend" to compile UI.');
    }
});

// Error Handler
app.use(errorHandler);

// Socket.IO Connection Handler
io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`[Socket.IO] Socket ${socket.id} joined room ${room}`);
    });

    socket.on('sync_trigger', (data) => {
        socket.broadcast.emit('sync_update', data);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
});

// Helper to get local IP address
const os = require('os');
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }
    return addresses;
}

// Start Server
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await initDB();
        server.listen(PORT, () => {
            const localIPs = getLocalIPs();
            const ipList = localIPs.map(ip => `  📱 Mobile/Tablet: http://${ip}:${PORT}`).join('\n');
            console.log(`
=====================================================
🚀 StudentOS Raspberry Pi Server Active!
💻 Local: http://localhost:${PORT}
${ipList || '  📱 Wi-Fi: Connect to Pi network'}
📁 DB Path: ${process.env.DB_PATH || './src/database/smartslate.db'}
⚡ Single-Process Mode | Chromium Kiosk Compatible
=====================================================
            `);
        });
    } catch (err) {
        console.error('[Server Error] Failed to initialize server:', err);
        process.exit(1);
    }
}

startServer();
