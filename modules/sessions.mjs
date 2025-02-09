import fs from 'node:fs/promises';
import session from "express-session";
import FileStore from "session-file-store";
import path from 'node:path';

const FileSessionStore = FileStore(session);
const sessionsDir = './sessions';

const sessions = session({
    store: new FileSessionStore({ path: sessionsDir, retries: 3 }),
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
  });

async function sessionsFolder() {
    try {
        await fs.access(sessionsDir);
    } catch (error) {
        await fs.mkdir(sessionsDir, { recursive: true });
        console.log('Sessions folder created');
    }
}

sessionsFolder();

export default sessions;