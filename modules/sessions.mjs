import * as crypto from "node:crypto";

const SESSION_KEY = "session";
const SESSIONS = {};

function startSession(req, res, next) {

    let sessionId = req.get(SESSION_KEY);
    let session = SESSIONS[sessionId];

    if (!sessionId) {
        sessionId = createUniqueSessionId(20, SESSIONS);
        session = { id: sessionId };
        SESSIONS[sessionId] = session;
    }

    res.set(SESSION_KEY, sessionId);
    req.session = session;
    next();
}

function updateSession(req, res, next) {
    SESSIONS[req.session.id] = req.session;
    next();
}

function createUniqueSessionId(length, sessions) {
    let id = "";
    do {
        id = crypto.randomBytes(length).toString("hex");
    } while (sessions[id] != undefined)
    return id;
}

export { startSession, updateSession };

/*
import session from 'express-session';
import FileStore from 'session-file-store';
import fs from 'node:fs/promises';

const FileSessionStore = FileStore(session);

let sessionLoggingLevel = 'verbose';

const sessionMiddleware = session({
    store: new FileSessionStore({ path: './sessions', retries: 3 }),
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
});

const setSessionLogLevel = (level) => {
    sessionLoggingLevel = level;
};

const logSessionActivity = async (req, res) => {
    if (!req.session.views) req.session.views = 0;
    req.session.views++;

    if (sessionLoggingLevel === 'verbose') {
        console.log(`${Date.now()}|Session views: ${req.session.views}`);
        await saveSessionLog(`${Date.now()}|Session views: ${req.session.views}`);
    }
};

const saveSessionLog = async (text) => {
    text += "\n";
    await fs.appendFile('./sessions/sessions.csv', text);
};

export default sessionMiddleware;
export { setSessionLogLevel, logSessionActivity };
*/