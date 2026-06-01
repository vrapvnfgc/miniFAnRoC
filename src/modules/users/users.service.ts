import bcrypt from 'bcryptjs'; // Sử dụng bcryptjs mã hóa 
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from './users.model';
import { config } from '../../config';
import { AppError } from '../../core/errors';

export class UserService {
  // Tạo tài khoản mới hệ thống 
  static async registerUser(userData: Partial<IUser>, plainPassword: string): Promise<IUser> {
    const isExisted = await UserModel.findOne({ username: userData.username });
    if (isExisted) {
      throw new AppError('Tên tài khoản này đã được đăng ký sử dụng', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    const user = new UserModel({
      username: userData.username,
      passwordHash,
      role: userData.role,
    });

    return await user.save();
  }

  // Xác thực đăng nhập sinh JWT token [cite: 42, 80]
  static async loginUser(username: string, plainPassword: string): Promise<{ token: string; user: any }> {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new AppError('Tài khoản hoặc mật khẩu không chính xác', 401);
    }

    const isMatched = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!isMatched) {
      throw new AppError('Tài khoản hoặc mật khẩu không chính xác', 401);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    };
  }
}