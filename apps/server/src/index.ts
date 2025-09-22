import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';
import authRouter from './routes/auth.route';
import categoriesRouter from './routes/categories.route';
import emailsRouter from './routes/emails.route';
import aiRouter from './routes/ai.route';

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.get('/health', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", authMiddleware, authRouter)
app.use("/api/categories", authMiddleware, categoriesRouter)
app.use("/api/emails", authMiddleware, emailsRouter)
app.use("/api/ai", authMiddleware, aiRouter)

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});