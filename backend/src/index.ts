import express from 'express';
import 'dotenv/config';

const app = express();
app.use(express.json());

app.post('/prompt', (req, res) => {
  const { message } = req.body;
  if (typeof message === 'string') {
    res.status(200).send({ received: message });
  } else {
    res.status(400).send({ error: 'Invalid message parameter' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
