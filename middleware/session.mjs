import * as crypto from "node:crypto";
import { createClient } from "redis";

const SESSION_KEY = "session";
const SESSION_TTL = 60 * 60 * 24;

const redisClient = createClient({ url: "redis://localhost:6379" });
redisClient.connect().catch(console.error);

async function startSession(req, res, next) {
    let sessionId = req.get(SESSION_KEY);
    let session;

    if (sessionId) {
        const sessionData = await redisClient.get(sessionId);
        if (sessionData) {
            session = JSON.parse(sessionData);
        }
    }

    if (!sessionId || !session) {
        sessionId = createUniqueSessionId(20);
        session = { id: sessionId };
        await redisClient.setEx(sessionId, SESSION_TTL, JSON.stringify(session));
    }

    res.set(SESSION_KEY, sessionId);
    req.session = session;
    next();
}

async function updateSession(req, res, next) {
    await redisClient.setEx(req.session.id, SESSION_TTL, JSON.stringify(req.session));
    next();
}

function createUniqueSessionId(length) {
    return crypto.randomBytes(length).toString("hex");
}

export { startSession, updateSession };
