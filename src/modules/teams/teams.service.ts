import { Team, ITeam } from './teams.model';
import mongoose from 'mongoose';

export class TeamsService {
  // Lấy danh sách tất cả các đội thi (Public)
  static async getAllTeams() {
    return await Team.find({}).sort({ teamNumber: 1 });
  }

  // Lấy chi tiết 1 đội kèm Lịch sử đấu và Xếp hạng (Public)
  static async getTeamById(id: string) {
    const team = await Team.findById(id);
    if (!team) {
      throw new Error('Không tìm thấy đội thi yêu cầu');
    }

    const MatchModel = mongoose.models.Match || mongoose.model('Match', new mongoose.Schema({}, { strict: false }));
    const matchHistory = await MatchModel.find({
      $or: [
        { 'blueAlliance.teams': team.teamNumber },
        { 'redAlliance.teams': team.teamNumber }
      ]
    }).sort({ matchNumber: 1 });

    const RankingModel = mongoose.models.Ranking || mongoose.model('Ranking', new mongoose.Schema({}, { strict: false }));
    const ranking = await RankingModel.findOne({ teamNumber: team.teamNumber }) || {
      rank: 'Chưa xếp hạng',
      wlt: '0/0/0',
      totalPoints: 0
    };

    return {
      profile: team,
      ranking,
      matches: matchHistory
    };
  }

  // Tạo đội thi mới (Admin) + Bổ sung kiểm tra trùng tên đội thi
  static async createTeam(teamData: Partial<ITeam>) {
    if (!teamData.teamNumber) {
      throw new Error('Số hiệu đội thi không được để trống');
    }
    if (!teamData.teamName) {
      throw new Error('Tên đội thi không được để trống');
    }
    
    // Chuẩn hóa dữ liệu đầu vào, xóa khoảng trắng thừa
    const cleanTeamNumber = teamData.teamNumber.trim();
    const cleanTeamName = teamData.teamName.trim();
    
    // 1. Kiểm tra trùng Số hiệu đội thi
    const teamNumberExists = await Team.findOne({ teamNumber: cleanTeamNumber });
    if (teamNumberExists) {
      throw new Error('Số hiệu đội thi này đã tồn tại trong hệ thống');
    }

    // 2. 🔥 KIỂM TRA TRÙNG TÊN ĐỘI THI: Nếu trùng sẽ hiện đúng thông báo yêu cầu
    const teamNameExists = await Team.findOne({ teamName: cleanTeamName });
    if (teamNameExists) {
      throw new Error('Tên đội thi đã tồn tại');
    }

    teamData.teamNumber = cleanTeamNumber;
    teamData.teamName = cleanTeamName;
    return await Team.create(teamData);
  }

  // Cập nhật thông tin đội thi (Admin) + Kiểm tra trùng tên khi sửa
  static async updateTeam(id: string, updateData: Partial<ITeam>) {
    if (updateData.teamNumber) updateData.teamNumber = updateData.teamNumber.trim();
    if (updateData.teamName) updateData.teamName = updateData.teamName.trim();

    // Nếu Admin muốn sửa tên đội, phải check xem tên mới có bị trùng với đội KHÁC không
    if (updateData.teamName) {
      const teamNameExists = await Team.findOne({ 
        teamName: updateData.teamName, 
        _id: { $ne: id } // Loại trừ chính đội đang sửa này ra
      });
      if (teamNameExists) {
        throw new Error('Tên đội thi đã tồn tại');
      }
    }

    const updatedTeam = await Team.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTeam) {
      throw new Error('Không tìm thấy dữ liệu đội thi để cập nhật');
    }
    return updatedTeam;
  }

  // Xóa đội thi khỏi hệ thống (Admin) -> Trả về số hiệu đội thi
  static async deleteTeam(id: string): Promise<string> {
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      throw new Error('Không tìm thấy dữ liệu đội thi để xóa');
    }

    // Dọn dẹp dữ liệu bảng xếp hạng liên quan (nếu có)
    if (mongoose.models.Ranking) {
      await mongoose.models.Ranking.deleteOne({ teamNumber: team.teamNumber });
    }
    
    return team.teamNumber;
  }
}