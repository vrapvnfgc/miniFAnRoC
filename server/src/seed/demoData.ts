import { CompetitionModel } from '../modules/competitions/competitions.model';
import { FieldModel } from '../modules/fields/fields.model';
import { MatchModel } from '../modules/matches/matches.model';
import { MatchScoreModel } from '../modules/scores/scores.model';
import { TeamModel } from '../modules/teams/teams.model';

type AllianceScoreSeed = {
	teleIndependent: number;
	sharedScore: number;
	penalties: number;
	endgame: number;
	endgameMultiplier: number;
};

function allianceScore(score: AllianceScoreSeed) {
	const total =
		(score.teleIndependent + score.sharedScore - score.penalties + score.endgame) *
		score.endgameMultiplier;

	return {
		...score,
		total
	};
}

const seedTeams = [
	{
		teamNumber: '9001',
		name: 'Saigon Sparks',
		school: 'Le Hong Phong High School for the Gifted',
		coach: 'Nguyen Minh An',
		robotName: 'Lotus-01',
		members: ['Bao Tran', 'Linh Pham', 'Minh Vo']
	},
	{
		teamNumber: '9002',
		name: 'Mekong Mechanics',
		school: 'Tran Dai Nghia High School',
		coach: 'Pham Quoc Huy',
		robotName: 'Delta',
		members: ['Khoa Nguyen', 'Anh Le', 'Nhi Dang']
	},
	{
		teamNumber: '9003',
		name: 'Hanoi Circuit',
		school: 'Hanoi - Amsterdam High School',
		coach: 'Le Thu Ha',
		robotName: 'Red River',
		members: ['Tuan Do', 'Trang Vu', 'Hung Bui']
	},
	{
		teamNumber: '9004',
		name: 'Da Nang Dynamos',
		school: 'Le Quy Don High School for the Gifted',
		coach: 'Tran Hoang Nam',
		robotName: 'Son Tra',
		members: ['Vy Ho', 'Duc Phan', 'Long Mai']
	},
	{
		teamNumber: '9005',
		name: 'Can Tho Coders',
		school: 'Chau Van Liem High School',
		coach: 'Huynh Thanh Lam',
		robotName: 'Ninh Kieu',
		members: ['Quyen Ly', 'Nam Cao', 'My Nguyen']
	},
	{
		teamNumber: '9006',
		name: 'Hue Automata',
		school: 'Quoc Hoc Hue High School',
		coach: 'Vo Kim Chi',
		robotName: 'Citadel',
		members: ['Tin Nguyen', 'Lan Tran', 'Phuc Ho']
	},
	{
		teamNumber: '9007',
		name: 'Vung Tau Velocity',
		school: 'Le Quy Don Vung Tau High School',
		coach: 'Dang Viet Anh',
		robotName: 'Hydro',
		members: ['Hieu Tran', 'Mai Pham', 'Quan Le']
	},
	{
		teamNumber: '9008',
		name: 'Bien Hoa Builders',
		school: 'Ngo Quyen High School',
		coach: 'Bui Khanh Linh',
		robotName: 'Core',
		members: ['Son Nguyen', 'Uyen Do', 'Thao Ho']
	}
];

export async function seedDemoData(): Promise<void> {
	const now = new Date();
	const nationalFinal = await CompetitionModel.findOneAndUpdate(
		{ name: 'Mini FAnRoC National Finals 2026' },
		{
			$set: {
				description: 'Demo national finals receiving advanced alliances from regional qualifiers.',
				nameEn: 'Mini FAnRoC National Finals 2026',
				nameVi: 'Chung kết Toàn quốc Mini FAnRoC 2026',
				descriptionEn: 'Demo national finals receiving advanced alliances from regional qualifiers.',
				descriptionVi: 'Dữ liệu mẫu cho chung kết toàn quốc nhận các liên minh thăng hạng từ vòng loại khu vực.',
				status: 'upcoming',
				startDate: new Date('2026-07-01T01:00:00.000Z'),
				endDate: new Date('2026-07-02T10:00:00.000Z')
			}
		},
		{ new: true, upsert: true, setDefaultsOnInsert: true }
	);

	const competition = await CompetitionModel.findOneAndUpdate(
		{ name: 'Mini FAnRoC Demo Championship 2026' },
		{
			$set: {
				description:
					'Demo competition seeded for local testing of competitions, matches, scores, and rankings.',
				nameEn: 'Mini FAnRoC Demo Championship 2026',
				nameVi: 'Giải Demo Mini FAnRoC 2026',
				descriptionEn:
					'Demo competition seeded for local testing of competitions, matches, scores, and rankings.',
				descriptionVi:
					'Dữ liệu mẫu để thử nghiệm giải đấu, trận đấu, điểm số và bảng xếp hạng.',
				status: 'active',
				nextCompetitionId: String(nationalFinal._id),
				startDate: new Date('2026-06-09T01:00:00.000Z'),
				endDate: new Date('2026-06-10T10:00:00.000Z')
			}
		},
		{ new: true, upsert: true, setDefaultsOnInsert: true }
	);

	const competitionId = String(competition._id);

	const fields = await Promise.all(
		[
			{
				name: 'Demo Field A',
				description: 'Primary field for qualification and playoff matches.'
			},
			{
				name: 'Demo Field B',
				description: 'Secondary field for queued demo matches.'
			}
		].map((field) =>
			FieldModel.findOneAndUpdate(
				{ name: field.name },
				{
					$set: {
						...field,
						competitionId,
						status: 'ACTIVE'
					}
				},
				{ new: true, upsert: true, setDefaultsOnInsert: true }
			)
		)
	);

	const teams = await Promise.all(
		seedTeams.map((team) =>
			TeamModel.findOneAndUpdate(
				{ teamNumber: team.teamNumber },
				{
					$set: team,
					$addToSet: { competitionIds: competitionId }
				},
				{ new: true, upsert: true, setDefaultsOnInsert: true }
			)
		)
	);

	const teamId = (teamNumber: string) => {
		const team = teams.find((item) => item.teamNumber === teamNumber);
		if (!team) {
			throw new Error(`Seed team ${teamNumber} was not created`);
		}

		return String(team._id);
	};

	const fieldAId = String(fields[0]._id);
	const fieldBId = String(fields[1]._id);

	const seededMatches = await Promise.all(
		[
			{
				matchNumber: 9001,
				phase: 'qualification',
				fieldId: fieldAId,
				redTeamIds: [teamId('9001'), teamId('9002')],
				blueTeamIds: [teamId('9003'), teamId('9004')],
				status: 'finished',
				scheduledTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
				startTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
				endTime: new Date(now.getTime() - 2.5 * 60 * 60 * 1000),
				notes: 'Seeded finished match with finalized score.',
				score: {
					red: allianceScore({
						teleIndependent: 38,
						sharedScore: 26,
						penalties: 4,
						endgame: 18,
						endgameMultiplier: 1
					}),
					blue: allianceScore({
						teleIndependent: 32,
						sharedScore: 26,
						penalties: 2,
						endgame: 20,
						endgameMultiplier: 1
					})
				}
			},
			{
				matchNumber: 9002,
				phase: 'qualification',
				fieldId: fieldBId,
				redTeamIds: [teamId('9005'), teamId('9006')],
				blueTeamIds: [teamId('9007'), teamId('9008')],
				status: 'finished',
				scheduledTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
				startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
				endTime: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
				notes: 'Seeded finished match with finalized score.',
				score: {
					red: allianceScore({
						teleIndependent: 45,
						sharedScore: 20,
						penalties: 0,
						endgame: 15,
						endgameMultiplier: 1
					}),
					blue: allianceScore({
						teleIndependent: 36,
						sharedScore: 20,
						penalties: 6,
						endgame: 16,
						endgameMultiplier: 1
					})
				}
			},
			{
				matchNumber: 9003,
				phase: 'qualification',
				fieldId: fieldAId,
				redTeamIds: [teamId('9001'), teamId('9005')],
				blueTeamIds: [teamId('9002'), teamId('9006')],
				status: 'scheduled',
				scheduledTime: new Date(now.getTime() + 45 * 60 * 1000),
				notes: 'Seeded upcoming qualification match.'
			},
			{
				matchNumber: 9004,
				phase: 'qualification',
				fieldId: fieldBId,
				redTeamIds: [teamId('9003'), teamId('9007')],
				blueTeamIds: [teamId('9004'), teamId('9008')],
				status: 'queued',
				scheduledTime: new Date(now.getTime() + 90 * 60 * 1000),
				notes: 'Seeded queued qualification match.'
			},
			{
				matchNumber: 9005,
				phase: 'semifinal',
				fieldId: fieldAId,
				redTeamIds: [teamId('9001'), teamId('9006')],
				blueTeamIds: [teamId('9004'), teamId('9007')],
				status: 'scheduled',
				scheduledTime: new Date(now.getTime() + 3 * 60 * 60 * 1000),
				notes: 'Seeded playoff preview match.'
			}
		].map(({ score, ...match }) =>
			MatchModel.findOneAndUpdate(
				{ matchNumber: match.matchNumber },
				{
					$set: {
						...match,
						competitionId
					}
				},
				{ new: true, upsert: true, setDefaultsOnInsert: true }
			).then((document) => ({ document, score }))
		)
	);

	await Promise.all(
		seededMatches
			.filter((match): match is typeof match & { score: NonNullable<typeof match.score> } =>
				Boolean(match.score)
			)
			.map(({ document, score }) =>
				MatchScoreModel.findOneAndUpdate(
					{ matchId: String(document._id) },
					{
						$set: {
							red: score.red,
							blue: score.blue,
							status: 'finalized',
							submittedAt: document.endTime,
							finalizedAt: document.endTime
						}
					},
					{ new: true, upsert: true, setDefaultsOnInsert: true }
				)
			)
	);

	console.log(
		`[Seed] Demo data ready: ${competition.name}, ${teams.length} teams, ${seededMatches.length} matches`
	);
}
