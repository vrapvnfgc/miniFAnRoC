import { Router, Request, Response, NextFunction } from 'express';
import { UserService } from './users.service';
import { requireAuth, requireRole } from '../../core/middlewares';

const router = Router();

// Đăng ký tài khoản (Chỉ Admin mới có quyền tạo tài khoản nhân sự sự kiện) [cite: 68, 125]
    router.post('/register',  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin username hoặc password' });
    }

    const createdUser = await UserService.registerUser({ username, role }, password);
    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công',
      data: {
        username: createdUser.username,
        role: createdUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Đăng nhập hệ thống cấp Token [cite: 80]
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Yêu cầu điền đầy đủ tài khoản và mật khẩu' });
    }

    const credentials = await UserService.loginUser(username, password);
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: credentials,
    });
  } catch (error) {
    next(error);
  }
});

export default router;