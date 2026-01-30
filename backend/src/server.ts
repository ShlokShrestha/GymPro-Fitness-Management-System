import express from "express";
import dotenv from "dotenv";
dotenv.config();
const server = express();

server.use("/", () => {
  console.log("Hello Gym System");
});
server.listen(process.env.SERVER_PORT, () => {
  console.log("Server is running in port", process.env.SERVER_PORT);
});
