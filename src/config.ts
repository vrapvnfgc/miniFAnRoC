import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/mini-fanroc',
  jwtSecret: process.env.JWT_SECRET || 'mini_fanroc_secret_key_2026_secured',
  nodeEnv: process.env.NODE_ENV || 'development',
};