import express from "express";
import HTTP_CODES from "./utils/httpCodes.mjs";
import userRouter from "./routes/userAPI.mjs";

const server = express();
const port = process.env.PORT || 8000;

server.set("port", port);

server.use(express.json());
server.use(express.static("public"));

server.use("/user", userRouter);

server.listen(server.get("port"), function () {
  console.log("server running", server.get("port"));
});