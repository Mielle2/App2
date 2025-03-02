import express from "express";
import HTTP_CODES from "./utils/httpCodes.mjs";
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';
import { startSession, updateSession } from './modules/sessions.mjs';
import treeRouter from './routes/treeAPI.mjs';
import questLogRouter from './routes/questLogAPI.mjs';
import userRouter from './routes/userAPI.mjs';

import { getRoot } from './modules/uke2.mjs';
import { getPoem, getQuote, getSum } from './modules/uke3.mjs';
import { makeDeck, shuffleDeck, getDeck, getCard } from './modules/uke4.mjs';

const ENABLE_LOGGING = false;

const server = express();
const port = process.env.PORT || 8000;

const logger = log(LOGG_LEVELS.VERBOSE);
setSessionLogLevel('verbose');

server.set("port", port);

server.use(logger);
server.use(express.json());
server.use(express.static("public"));
server.use(startSession);
server.use("/tree/", treeRouter);
server.use("/quest", questLogRouter);
server.use("/user", userRouter)
server.use(updateSession);

// Uke 2
server.get("/", getRoot);

// Uke 3
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getQuote);
server.post("/tmp/sum/:a/:b", getSum);

// Uke 4
server.post("/temp/deck", makeDeck);
server.patch("/temp/deck/shuffle/:deck_id", shuffleDeck);
server.get("/temp/deck/:deck_id", getDeck);
server.get("/temp/deck/:deck_id/card", getCard);

server.listen(server.get("port"), function () {
  console.log("server running", server.get("port"));
});