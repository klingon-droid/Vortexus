import express from 'express';
import 'dotenv/config';
import './telegram/telegramBot';
import OpenAI from 'openai';
import helmet from 'helmet';
import cors from 'cors';
import { createAssistant } from './openai/createAssistant.ts';
import { getOrCreateThread } from './openai/createThread.ts';
import { createRun } from './openai/createRun.ts';
import { performRun } from './openai/performRun.ts';


const client = new OpenAI();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.post('/prompt', async (req, res) => {
  let { message, walletAddress, threadId } = req.body;
  if (typeof message !== 'string') {
    res.status(400).send({ error: 'Invalid message parameter' });
    return;
  }

  try {
    const assistant = await createAssistant(client);
    const thread = await getOrCreateThread(client, message, threadId);

    if (walletAddress) {
      message += `\nThe deployer/user wallet address is: ${walletAddress}`;
    }
    // Add the user's message to the thread
    await client.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    });

    // Create and perform the run
    const run = await createRun(client, thread, assistant.id);
    const result = await performRun(run, client, thread);

    res.status(200).send({ response: result.response, output: result.output, threadId: thread.id });
  } catch (error) {
    console.error('Error during chat:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
