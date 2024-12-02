import { createClient } from "redis";

const client = createClient();

const problemSubmission = async (submission: string) => {
  const { problemId, code, language } = JSON.parse(submission);
  console.log(`processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`language ${language}`);

  // Actual processing logic

  // simulating processing delay
  await new Promise((r) => setTimeout(r, 3000));
  console.log(`Finished processing submission for problemId ${problemId}`);
};
const startWorker = async () => {
  try {
    await client.connect();
    console.log("Worker connected to redis");

    while (true) {
      try {
        const submission = await client.brPop("problemsQueue", 0);
        await problemSubmission(submission.element);
      } catch (err) {
        console.log("Error: ", err);
        // implement error handling logic here
        // 1) we can push the submission back onto the queue
        // 2) Log the error in file
      }
    }
  } catch (err) {
    console.log("Redis connection error: ", err);
  }
};
startWorker();
