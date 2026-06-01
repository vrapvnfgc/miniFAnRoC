import http from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { config } from './config';

const server = http.createServer(app);

// Cấu hình Socket.IO đáp ứng yêu cầu Real-time [cite: 42, 77, 139]
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket] Thiết bị kết nối thành công: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket] Thiết bị đã ngắt kết nối: ${socket.id}`);
  });
});

// Lưu Socket IO instance vào app để sử dụng linh hoạt tại các module phát điểm số
app.set('io', io);

// Kết nối database thông qua môi trường Docker và khởi động Server [cite: 42, 65]
const bootstrap = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Kết nối thành công cơ sở dữ liệu MongoDB (Docker Setup)');

    server.listen(config.port, () => {
      console.log(`🚀 Hệ thống đang phân phối tại: http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động hệ thống:', error);
    process.exit(1);
  }
};

bootstrap();