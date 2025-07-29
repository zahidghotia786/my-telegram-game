import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(cors({
  origin: "https://af5d554a3804.ngrok-free.app", // <-- ngrok frontend
  credentials: true,
}));
app.use(express.json());

app.use('/api', authRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Casino Bot API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
