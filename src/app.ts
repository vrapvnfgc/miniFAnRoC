import express from 'express';
import cors from 'cors';
import { errorHandler } from './core/middlewares';
import healthRoutes from './modules/health/health.routes';
import usersRoutes from './modules/users/users.routes';
import teamsRoutes from './modules/teams/teams.routes'; // 1. Import module teams mới vào

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes định nghĩa theo chuẩn tài liệu /api/v1/
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/teams', teamsRoutes); // 2. Đăng ký route teams ở đây (đúng vị trí trên route 404)

// Khớp tất cả các route không tồn tại (Bẫy lỗi 404)
app.use('*', (req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint không tồn tại' });
});

// Kích hoạt Error Handler hệ thống
app.use(errorHandler);

export default app;