import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import cors from 'cors';
import healthRoutes from './health.routes';

const app = express();
app.use(express.json());
app.use('/api/v1/health', healthRoutes);

describe('Health Module Integration Test', () => {
  it('GET /api/v1/health/ping - Nên phản hồi trạng thái pong thành công', async () => {
    // Giả lập xử lý thủ công cho kiểm thử gọn nhẹ không phụ thuộc thư viện mạng ngoài
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    const req = {} as any;
    
    // Gọi trực tiếp router handler
    const routerStack = healthRoutes.stack.find((s) => s.route.path === '/ping');
    await routerStack.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'pong',
      })
    );
  });
});