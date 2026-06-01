import { Router, Request, Response, NextFunction } from 'express';
import { TeamsService } from './teams.service';

const router = Router();

// Middleware xác thực quyền Admin bằng mã PIN đơn giản theo tài liệu
const protectAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const adminPin = req.headers['x-admin-pin'];
  const requiredPin = process.env.ADMIN_PIN || '2026';

  if (adminPin && adminPin === requiredPin) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Quyền truy cập bị từ chối. Mã PIN Admin không đúng!' });
  }
};

// GET /api/v1/teams - Lấy danh sách toàn bộ các đội thi (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await TeamsService.getAllTeams();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/teams/:id - Lấy chi tiết đội kèm lịch sử đấu và hạng (Public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await TeamsService.getTeamById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

// POST /api/v1/teams - Tạo đội thi mới (Chỉ Admin) + Phát tín hiệu Real-time
router.post('/', protectAdmin, async (req: Request, res: Response) => {
  try {
    const data = await TeamsService.createTeam(req.body);
    
    // 🔥 REAL-TIME: Lấy Socket.IO instance và phát sự kiện cập nhật danh sách đội thi
    const io = req.app.get('io');
    if (io) {
      io.emit('team_created', data);
    }

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/teams/:id - Cập nhật thông tin đội thi (Chỉ Admin) + Phát tín hiệu Real-time
router.put('/:id', protectAdmin, async (req: Request, res: Response) => {
  try {
    const data = await TeamsService.updateTeam(req.params.id, req.body);
    
    // 🔥 REAL-TIME: Phát sự kiện cập nhật thông tin đội thi trực tiếp lên màn hình hiển thị
    const io = req.app.get('io');
    if (io) {
      io.emit('team_updated', data);
    }

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/v1/teams/:id - Xóa đội thi (Chỉ Admin) + Phát tín hiệu Real-time
router.delete('/:id', protectAdmin, async (req: Request, res: Response) => {
  try {
    const teamNumber = await TeamsService.deleteTeam(req.params.id);
    
    // 🔥 REAL-TIME: Phát sự kiện thông báo xóa đội thi để client xóa trực tiếp khỏi bảng hiển thị
    const io = req.app.get('io');
    if (io) {
      io.emit('team_deleted', { id: req.params.id, teamNumber });
    }

    res.status(200).json({ success: true, message: 'Đã xóa đội thi thành công khỏi hệ thống' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;