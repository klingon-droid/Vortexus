import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import { Keypair, Transaction, Connection } from '@solana/web3.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

const db = new Pool({ connectionString: process.env.DATABASE_URL });

const connection = new Connection(process.env.SOLANA_URL!);

const IV_LENGTH = 16;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM

interface BackendResponse {
  transaction?: string;
  response?: string;
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH); 
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'utf-8'),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`; 
}

function decrypt(text: string): string {
  const [iv, encryptedText] = text.split(':');
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'utf-8'),
    Buffer.from(iv, 'hex'),
  );
  let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

async function generateWallet(chatId: number) {
  const wallet = Keypair.generate();
  const publicKey = wallet.publicKey.toBase58();
  const privateKey = encrypt(Buffer.from(wallet.secretKey).toString('base64'));

  await db.query(
    `INSERT INTO user_wallets (telegram_id, public_key, private_key) 
     VALUES ($1, $2, $3) ON CONFLICT (telegram_id) DO NOTHING`,
    [chatId, publicKey, privateKey]
  );

  return publicKey;
}

async function isLocked(chatId: number): Promise<boolean> {
  const result = await db.query(`SELECT is_locked FROM user_wallets WHERE telegram_id = $1`, [chatId]);
  return result.rows[0]?.is_locked || false;
}

async function handlePrompt(chatId: number, prompt: string): Promise<string> {
  const response = await fetch(`${process.env.BACKEND_URL}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt }),
  });

  const result: BackendResponse = await response.json();

  if (result.transaction) {
    const userWallet = await db.query(`SELECT private_key FROM user_wallets WHERE telegram_id = $1`, [chatId]);
    const privateKey = decrypt(userWallet.rows[0].private_key);

    const wallet = Keypair.fromSecretKey(Buffer.from(privateKey, 'base64'));
    const transaction = Transaction.from(Buffer.from(result.transaction, 'base64'));

    transaction.sign(wallet);

    const signature = await connection.sendRawTransaction(transaction.serialize());
    return `Transaction submitted! Signature: ${signature}`;
  }

  return result.response || 'No response received from backend.';
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const publicKey = await generateWallet(chatId);

  bot.sendMessage(chatId, `Welcome! A dedicated wallet has been created for you.\nPublic Key: ${publicKey}`);
});

bot.onText(/\/lock/, async (msg) => {
  const chatId = msg.chat.id;
  await db.query(`UPDATE user_wallets SET is_locked = true WHERE telegram_id = $1`, [chatId]);

  bot.sendMessage(chatId, 'Your bot has been locked. Use /unlock <password> to unlock.');
});

bot.onText(/\/unlock (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const password = match?.[1];

  const user = await db.query(`SELECT password FROM user_wallets WHERE telegram_id = $1`, [chatId]);
  if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password)) {
    await db.query(`UPDATE user_wallets SET is_locked = false WHERE telegram_id = $1`, [chatId]);
    bot.sendMessage(chatId, 'Bot unlocked successfully.');
  } else {
    bot.sendMessage(chatId, 'Incorrect password. Please try again.');
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) return;

  if (await isLocked(chatId)) {
    bot.sendMessage(chatId, 'The bot is currently locked. Use /unlock <password> to unlock.');
    return;
  }

  const response = await handlePrompt(chatId, text);
  bot.sendMessage(chatId, response);
});
