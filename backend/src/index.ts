import express from 'express';
import 'dotenv/config';
import OpenAI from 'openai';
import { createAssistant } from './openai/createAssistant.ts';
import { createThread } from './openai/createThread.ts';
import { createRun } from './openai/createRun.ts';
import { performRun } from './openai/performRun.ts';

const client = new OpenAI();

const app = express();
app.use(express.json());

app.post('/prompt', async (req, res) => {
  const { message } = req.body;
  if (typeof message === 'string') {
    try {
      const assistant = await createAssistant(client);
      const thread = await createThread(client);

      // Add the user's message to the thread
      await client.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: message,
      });

      // Create and perform the run
      const run = await createRun(client, thread, assistant.id);
      const result = await performRun(run, client, thread);

      res.status(200).send({ response: result.response, output: result.output });
    } catch (error) {
      console.error('Error during chat:', error instanceof Error ? error.message : 'Unknown error');
      res.status(500).send({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).send({ error: 'Invalid message parameter' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
