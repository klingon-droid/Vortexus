import express from 'express';
import 'dotenv/config';
import OpenAI from 'openai';

const client = new OpenAI();

const app = express();
app.use(express.json());

app.post('/prompt', async (req, res) => {
  const { message } = req.body;
  if (typeof message === 'string') {
    try {
      res.status(200).send({ response: message });
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
