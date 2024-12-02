// Leetcode backend

import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();
client.on("error", (err) => console.log("Redis client error: ", err));

app.post("/submit", async (req, res) => {
  const { problemId, code, language } = req.body;
  try {
    await client.lPush(
      "problemsQueue",
      JSON.stringify({ problemId, language, code })
    );
    res.status(200).send("Submission received and stored.");
  } catch (err) {
    console.log("Redis error: ", err);
    res.status(500).send("Failed to store Submission");
  }
});

const startServer = async () => {
  try {
    await client.connect();
    console.log("connected to redis");
    app.listen(3000, () => {
      console.log(`primary backend is running on 3000`);
    });
  } catch (err) {
    console.log("Failed connect to redis: ", err);
  }
};

startServer();
