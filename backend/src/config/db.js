const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../database/smartslate.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance = null;

async function getDB() {
    if (dbInstance) return dbInstance;

    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await dbInstance.run('PRAGMA foreign_keys = ON;');
    await dbInstance.run('PRAGMA journal_mode = WAL;');
    await dbInstance.run('PRAGMA synchronous = NORMAL;');
    await dbInstance.run('PRAGMA cache_size = -2000;');
    await dbInstance.run('PRAGMA busy_timeout = 5000;');
    return dbInstance;
}

async function initDB() {
    const db = await getDB();
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema statements split by semicolon
    const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    for (const stmt of statements) {
        await db.exec(stmt);
    }

    console.log('[Database] SQLite Schema Initialized successfully at:', dbPath);
    return db;
}

module.exports = {
    getDB,
    initDB
};
