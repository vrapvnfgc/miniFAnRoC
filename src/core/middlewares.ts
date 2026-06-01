import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errors';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: 'Admin' | 'Head Referee' | 'Scorekeeper' | 'Spectator';
      };
    }
  }
}

// Global Error Handler Middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi hệ thống nội bộ';

  res.status(statusCode).json({
    success: false,
    message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
};

// Authentication Middleware
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Vui lòng đăng nhập để truy cập', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return next(new AppError('Phiên đăng nhập hết hạn hoặc không hợp lệ', 401));
  }
};

// Role Authorization Middleware [cite: 68]
export const requireRole = (roles: ('Admin' | 'Head Referee' | 'Scorekeeper' | 'Spectator')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền thực hiện hành động này', 403));
    }
    next();
  };
};