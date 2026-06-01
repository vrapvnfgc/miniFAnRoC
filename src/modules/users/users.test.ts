import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './users.service';
import { UserModel } from './users.model';

vi.mock('./users.model', () => {
  return {
    UserModel: {
      findOne: vi.fn(),
      prototype: {
        save: vi.fn(),
      },
    },
  };
});

describe('User Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loginUser - Nên ném lỗi AppError nếu không tìm thấy username', async () => {
    vi.mocked(UserModel.findOne).mockResolvedValue(null);

    await expect(
      UserService.loginUser('wronguser', 'password123')
    ).rejects.toThrow('Tài khoản hoặc mật khẩu không chính xác');
  });
});