// scripts/sendWebAppButton.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const WEBAPP_URL = process.env.FRONTEND_URL;

if (!BOT_TOKEN || !CHAT_ID || !WEBAPP_URL) {
  console.error("❌ Missing BOT_TOKEN, CHAT_ID, or FRONTEND_URL in .env");
  process.exit(1);
}

console.log('Using FRONTEND_URL:', WEBAPP_URL);

const sendWebAppButton = async () => {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const payload = {
      chat_id: CHAT_ID,
      text: '🎰 Welcome to the Casino! Click below to play.',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🎮 Play Now',
              web_app: {
                url: WEBAPP_URL
              }
            }
          ]
        ]
      }
    };

    const res = await axios.post(url, payload);
    console.log('✅ WebApp button sent successfully:', res.data);
  } catch (err) {
    console.error('❌ Failed to send WebApp button:', err.response?.data || err.message);
  }
};

sendWebAppButton();
