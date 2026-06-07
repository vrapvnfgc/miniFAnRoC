<script lang="ts">
	import { CalendarDays, ChevronRight, Medal, Trophy, UsersRound } from 'lucide-svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { languageStore } from '$lib/stores/language.svelte';

	type CompetitionKey = 'finals' | 'hanoi' | 'thanhhoa' | 'danang' | 'cantho';
	type AllianceColor = 'red' | 'blue';

	type Team = {
		code: string;
		name: string;
		competition: CompetitionKey;
	};

	type AllianceScore = {
		teleIndependent: number;
		sharedScore: number;
		endgame: number;
		penalties: number;
		multiplier: number;
		total: number;
	};

	type Match = {
		id: string;
		competition: CompetitionKey;
		phase: 'qualification' | 'knockout';
		field: string;
		time: string;
		redTeams: string[];
		blueTeams: string[];
		red: AllianceScore;
		blue: AllianceScore;
	};

	const text = {
		vi: {
			title: 'Trung tâm cuộc thi',
			subtitle:
				'Giao diện xem trước cho bảng xếp hạng, trận đấu, breakdown điểm, liên minh xuất sắc và báo cáo giải thưởng.',
			demo: 'Đang dùng dữ liệu mẫu frontend, chưa fetch CSDL.',
			finals: 'Chung kết toàn quốc',
			qualifiers: 'Các vòng loại khu vực',
			hanoi: 'Hà Nội',
			thanhhoa: 'Thanh Hóa',
			danang: 'Đà Nẵng',
			cantho: 'Cần Thơ',
			ranking: 'Bảng xếp hạng đội',
			matches: 'Danh sách trận đấu',
			qualification: 'Vòng loại',
			knockout: 'Vòng loại trực tiếp 6 liên minh',
			topAlliances: '3 liên minh xuất sắc nhất',
			awards: 'Báo cáo giải thưởng',
			placeholder: 'Placeholder: phần này sẽ nối dữ liệu backend khi module tương ứng hoàn thiện.',
			rank: 'Hạng',
			teamCode: 'Mã đội',
			teamName: 'Tên đội',
			played: 'Số trận',
			best: 'Điểm cao nhất',
			total: 'Tổng điểm',
			field: 'Sân',
			time: 'Thời gian',
			red: 'Liên minh đỏ',
			blue: 'Liên minh xanh',
			breakdown: 'Breakdown trận đấu',
			close: 'Đóng',
			view: 'Xem breakdown',
			tele: 'Điểm theo liên minh',
			shared: 'Điểm hợp tác',
			endgame: 'Endgame',
			penalty: 'Penalty',
			multiplier: 'Hệ số nhân',
			score: 'Điểm'
		},
		en: {
			title: 'Competition center',
			subtitle:
				'Frontend preview for rankings, matches, score breakdowns, top alliances, and awards reports.',
			demo: 'Using frontend sample data, no database fetch is required.',
			finals: 'National Finals',
			qualifiers: 'Regional qualifiers',
			hanoi: 'Hanoi',
			thanhhoa: 'Thanh Hoa',
			danang: 'Da Nang',
			cantho: 'Can Tho',
			ranking: 'Team ranking',
			matches: 'Match list',
			qualification: 'Qualification',
			knockout: '6-alliance knockout',
			topAlliances: 'Top 3 alliances',
			awards: 'Awards report',
			placeholder: 'Placeholder: this section will connect to backend data when its module is ready.',
			rank: 'Rank',
			teamCode: 'Team code',
			teamName: 'Team name',
			played: 'Played',
			best: 'Best score',
			total: 'Total score',
			field: 'Field',
			time: 'Time',
			red: 'Red alliance',
			blue: 'Blue alliance',
			breakdown: 'Match breakdown',
			close: 'Close',
			view: 'View breakdown',
			tele: 'Alliance score',
			shared: 'Shared score',
			endgame: 'Endgame',
			penalty: 'Penalty',
			multiplier: 'Multiplier',
			score: 'Score'
		}
	} as const;

	const competitions = [
		{
			key: 'finals' as CompetitionKey,
			label: { vi: 'Chung kết toàn quốc', en: 'National Finals' },
			description: { vi: 'Sân chơi cuối cùng của các đội xuất sắc.', en: 'The final stage for top teams.' }
		},
		{
			key: 'hanoi' as CompetitionKey,
			label: { vi: 'Hà Nội', en: 'Hanoi' },
			description: { vi: 'Vòng loại khu vực phía Bắc.', en: 'Northern regional qualifier.' }
		},
		{
			key: 'thanhhoa' as CompetitionKey,
			label: { vi: 'Thanh Hóa', en: 'Thanh Hoa' },
			description: { vi: 'Vòng loại khu vực Thanh Hóa.', en: 'Thanh Hoa regional qualifier.' }
		},
		{
			key: 'danang' as CompetitionKey,
			label: { vi: 'Đà Nẵng', en: 'Da Nang' },
			description: { vi: 'Vòng loại khu vực miền Trung.', en: 'Central regional qualifier.' }
		},
		{
			key: 'cantho' as CompetitionKey,
			label: { vi: 'Cần Thơ', en: 'Can Tho' },
			description: { vi: 'Vòng loại khu vực miền Nam.', en: 'Southern regional qualifier.' }
		}
	];

	const teams: Team[] = [
		{ code: 'NF01', name: 'Alpha Circuit', competition: 'finals' },
		{ code: 'NF02', name: 'Quantum Bot', competition: 'finals' },
		{ code: 'HN01', name: 'Hanoi Sparks', competition: 'hanoi' },
		{ code: 'HN02', name: 'Red River Robotics', competition: 'hanoi' },
		{ code: 'TH01', name: 'Lam Son Gear', competition: 'thanhhoa' },
		{ code: 'TH02', name: 'Blue Stone', competition: 'thanhhoa' },
		{ code: 'DN01', name: 'Han River Mech', competition: 'danang' },
		{ code: 'DN02', name: 'Central Code', competition: 'danang' },
		{ code: 'CT01', name: 'Mekong Makers', competition: 'cantho' },
		{ code: 'CT02', name: 'Delta Drive', competition: 'cantho' }
	];

	const matches: Match[] = [
		createMatch('NF-Q1', 'finals', 'qualification', 'Sân 1', '08:30 12/10/2026', ['NF01', 'NF02'], ['NF02', 'NF01'], 132, 118),
		createMatch('NF-K1', 'finals', 'knockout', 'Sân 1', '14:00 12/10/2026', ['NF01', 'NF02'], ['NF02', 'NF01'], 146, 140),
		createMatch('HN-Q1', 'hanoi', 'qualification', 'Sân 2', '09:00 14/09/2026', ['HN01', 'HN02'], ['HN02', 'HN01'], 125, 111),
		createMatch('HN-K1', 'hanoi', 'knockout', 'Sân 2', '15:30 14/09/2026', ['HN01', 'HN02'], ['HN02', 'HN01'], 138, 130),
		createMatch('TH-Q1', 'thanhhoa', 'qualification', 'Sân 3', '09:30 15/09/2026', ['TH01', 'TH02'], ['TH02', 'TH01'], 122, 116),
		createMatch('TH-K1', 'thanhhoa', 'knockout', 'Sân 3', '15:00 15/09/2026', ['TH01', 'TH02'], ['TH02', 'TH01'], 134, 126),
		createMatch('DN-Q1', 'danang', 'qualification', 'Sân 4', '10:00 16/09/2026', ['DN01', 'DN02'], ['DN02', 'DN01'], 129, 119),
		createMatch('DN-K1', 'danang', 'knockout', 'Sân 4', '16:00 16/09/2026', ['DN01', 'DN02'], ['DN02', 'DN01'], 141, 133),
		createMatch('CT-Q1', 'cantho', 'qualification', 'Sân 5', '10:30 17/09/2026', ['CT01', 'CT02'], ['CT02', 'CT01'], 127, 114),
		createMatch('CT-K1', 'cantho', 'knockout', 'Sân 5', '16:30 17/09/2026', ['CT01', 'CT02'], ['CT02', 'CT01'], 139, 128)
	];

	let selected = $state<CompetitionKey>('finals');
	let selectedMatchId = $state<string | null>(null);
	let t = $derived(text[languageStore.locale]);
	let selectedCompetition = $derived(competitions.find((item) => item.key === selected) ?? competitions[0]);
	let selectedMatches = $derived(matches.filter((match) => match.competition === selected));
	let selectedTeams = $derived(teams.filter((team) => team.competition === selected));
	let rankingRows = $derived(getRankingRows());
	let topAlliances = $derived(getTopAlliances());
	let selectedMatch = $derived(matches.find((match) => match.id === selectedMatchId));

	function createScore(total: number): AllianceScore {
		return {
			teleIndependent: Math.round(total * 0.52),
			sharedScore: 18,
			endgame: 22,
			penalties: total % 2 === 0 ? 0 : 5,
			multiplier: 1.2,
			total
		};
	}

	function createMatch(
		id: string,
		competition: CompetitionKey,
		phase: Match['phase'],
		field: string,
		time: string,
		redTeams: string[],
		blueTeams: string[],
		redTotal: number,
		blueTotal: number
	): Match {
		return {
			id,
			competition,
			phase,
			field,
			time,
			redTeams,
			blueTeams,
			red: createScore(redTotal),
			blue: createScore(blueTotal)
		};
	}

	function teamName(code: string) {
		const team = teams.find((item) => item.code === code);
		return team ? `${team.code} ${team.name}` : code;
	}

	function getRankingRows() {
		return selectedTeams
			.map((team) => {
				const teamScores = selectedMatches.flatMap((match) => {
					const scores = [];
					if (match.redTeams.includes(team.code)) scores.push(match.red.total);
					if (match.blueTeams.includes(team.code)) scores.push(match.blue.total);
					return scores;
				});
				return {
					...team,
					played: teamScores.length,
					best: Math.max(...teamScores, 0),
					total: teamScores.reduce((sum, score) => sum + score, 0)
				};
			})
			.sort((a, b) => b.total - a.total || b.played - a.played || b.best - a.best || a.code.localeCompare(b.code))
			.map((team, index) => ({ ...team, rank: index + 1 }));
	}

	function getTopAlliances() {
		return selectedMatches
			.filter((match) => match.phase === 'qualification')
			.flatMap((match) => [
				{ match, color: 'red' as AllianceColor, score: match.red.total, teams: match.redTeams },
				{ match, color: 'blue' as AllianceColor, score: match.blue.total, teams: match.blueTeams }
			])
			.sort((a, b) => b.score - a.score)
			.slice(0, 3);
	}
</script>

<svelte:head>
	<title>{t.title} | miniFAnRoC</title>
	<meta name="description" content={t.subtitle} />
</svelte:head>

<div class="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
	<Navbar />

	<main class="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
		<section class="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
			<p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">miniFAnRoC</p>
			<div class="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h1 class="text-3xl font-black tracking-tight sm:text-5xl">{t.title}</h1>
					<p class="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{t.subtitle}</p>
				</div>
				<div class="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
					{t.demo}
				</div>
			</div>
		</section>

		<section class="mb-8">
			<div class="mx-auto mb-4 max-w-xl">
				<button
					type="button"
					onclick={() => (selected = 'finals')}
					class={`w-full rounded-2xl border p-5 text-left transition ${selected === 'finals' ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/10 dark:bg-cyan-500/10' : 'border-slate-200 bg-white hover:border-cyan-300 dark:border-white/10 dark:bg-slate-900/70'}`}
				>
					<div class="flex items-center justify-between gap-3">
						<div>
							<p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{t.finals}</p>
							<h2 class="mt-2 text-xl font-black">{competitions[0].label[languageStore.locale]}</h2>
							<p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{competitions[0].description[languageStore.locale]}</p>
						</div>
						<Trophy class="h-6 w-6 text-cyan-500" />
					</div>
				</button>
			</div>

			<p class="mb-3 text-sm font-bold text-slate-600 dark:text-slate-300">{t.qualifiers}</p>
			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{#each competitions.slice(1) as item}
					<button
						type="button"
						onclick={() => (selected = item.key)}
						class={`rounded-2xl border p-4 text-left transition ${selected === item.key ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/10 dark:bg-cyan-500/10' : 'border-slate-200 bg-white hover:border-cyan-300 dark:border-white/10 dark:bg-slate-900/70'}`}
					>
						<div class="flex items-center justify-between gap-3">
							<div>
								<h3 class="text-lg font-bold">{item.label[languageStore.locale]}</h3>
								<p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description[languageStore.locale]}</p>
							</div>
							<ChevronRight class="h-5 w-5 text-cyan-500" />
						</div>
					</button>
				{/each}
			</div>
		</section>

		<section class="mb-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
			<div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70">
				<h2 class="mb-4 flex items-center gap-2 text-xl font-black">
					<UsersRound class="h-5 w-5 text-cyan-500" />
					{t.ranking}
				</h2>
				<div class="overflow-x-auto">
					<table class="w-full min-w-[720px] text-left text-sm">
						<thead class="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
							<tr class="border-b border-slate-200 dark:border-white/10">
								<th class="py-3 pr-3">{t.rank}</th>
								<th class="py-3 pr-3">{t.teamCode}</th>
								<th class="py-3 pr-3">{t.teamName}</th>
								<th class="py-3 pr-3 text-right">{t.played}</th>
								<th class="py-3 pr-3 text-right">{t.best}</th>
								<th class="py-3 text-right">{t.total}</th>
							</tr>
						</thead>
						<tbody>
							{#each rankingRows as row}
								<tr class="border-b border-slate-100 dark:border-white/5">
									<td class="py-3 pr-3 font-black">{row.rank}</td>
									<td class="py-3 pr-3 font-mono font-semibold">{row.code}</td>
									<td class="py-3 pr-3 font-semibold">{row.name}</td>
									<td class="py-3 pr-3 text-right">{row.played}</td>
									<td class="py-3 pr-3 text-right">{row.best}</td>
									<td class="py-3 text-right font-black text-cyan-600 dark:text-cyan-400">{row.total}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<div class="space-y-5">
				<div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70">
					<h2 class="flex items-center gap-2 text-xl font-black">
						<Medal class="h-5 w-5 text-cyan-500" />
						{t.topAlliances}
					</h2>
					<div class="mt-4 space-y-3">
						{#each topAlliances as item, index}
							<div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/70">
								<div class="flex items-center justify-between gap-3">
									<p class="font-black">#{index + 1} {item.color === 'red' ? t.red : t.blue}</p>
									<p class="text-lg font-black text-cyan-600 dark:text-cyan-400">{item.score}</p>
								</div>
								<p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.match.id} · {item.teams.map(teamName).join(' · ')}</p>
							</div>
						{/each}
					</div>
				</div>

				<div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70">
					<h2 class="flex items-center gap-2 text-xl font-black">
						<Trophy class="h-5 w-5 text-cyan-500" />
						{t.awards}
					</h2>
					<p class="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">{t.placeholder}</p>
				</div>
			</div>
		</section>

		<section class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70">
			<h2 class="mb-5 flex items-center gap-2 text-xl font-black">
				<CalendarDays class="h-5 w-5 text-cyan-500" />
				{t.matches} · {selectedCompetition.label[languageStore.locale]}
			</h2>
			<div class="grid gap-5 xl:grid-cols-2">
				{@render MatchColumn(t.qualification, 'qualification')}
				{@render MatchColumn(t.knockout, 'knockout')}
			</div>
		</section>
	</main>

	<Footer />
</div>

{#snippet MatchColumn(title: string, phase: Match['phase'])}
	<div>
		<h3 class="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{title}</h3>
		<div class="space-y-3">
			{#each selectedMatches.filter((match) => match.phase === phase) as match}
				<button
					type="button"
					onclick={() => (selectedMatchId = match.id)}
					class="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-cyan-300 hover:bg-white dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-slate-900"
				>
					<div class="flex flex-wrap items-center justify-between gap-3">
						<p class="font-mono text-sm font-black">{match.id}</p>
						<p class="text-sm text-slate-500 dark:text-slate-400">{match.field} · {match.time}</p>
					</div>
					<div class="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
						<div class="rounded-lg bg-red-50 p-3 dark:bg-red-500/10">
							<p class="text-xs font-bold uppercase tracking-[0.14em] text-red-600 dark:text-red-300">{t.red}</p>
							<p class="mt-1 text-sm font-semibold">{match.redTeams.map(teamName).join(' · ')}</p>
						</div>
						<p class="text-center text-lg font-black text-cyan-600 dark:text-cyan-400">{match.red.total} - {match.blue.total}</p>
						<div class="rounded-lg bg-sky-50 p-3 dark:bg-sky-500/10">
							<p class="text-xs font-bold uppercase tracking-[0.14em] text-sky-600 dark:text-sky-300">{t.blue}</p>
							<p class="mt-1 text-sm font-semibold">{match.blueTeams.map(teamName).join(' · ')}</p>
						</div>
					</div>
					<p class="mt-3 text-sm font-semibold text-cyan-600 dark:text-cyan-400">{t.view}</p>
				</button>
			{/each}
		</div>
	</div>
{/snippet}

{#if selectedMatch}
	<div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
		<div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
			<div class="mb-5 flex items-start justify-between gap-4">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{t.breakdown}</p>
					<h2 class="mt-2 text-2xl font-black">{selectedMatch.id}</h2>
					<p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{selectedMatch.field} · {selectedMatch.time}</p>
				</div>
				<button
					type="button"
					onclick={() => (selectedMatchId = null)}
					class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
				>
					{t.close}
				</button>
			</div>
			<div class="grid gap-4 md:grid-cols-2">
				{@render BreakdownPanel('red', selectedMatch.red, selectedMatch.redTeams)}
				{@render BreakdownPanel('blue', selectedMatch.blue, selectedMatch.blueTeams)}
			</div>
		</div>
	</div>
{/if}

{#snippet BreakdownPanel(color: AllianceColor, score: AllianceScore, teamCodes: string[])}
	<div class={`rounded-xl p-4 ${color === 'red' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-sky-50 dark:bg-sky-500/10'}`}>
		<h3 class={`font-black ${color === 'red' ? 'text-red-700 dark:text-red-300' : 'text-sky-700 dark:text-sky-300'}`}>{color === 'red' ? t.red : t.blue}</h3>
		<p class="mt-1 text-sm text-slate-700 dark:text-slate-300">{teamCodes.map(teamName).join(' · ')}</p>
		<div class="mt-4 space-y-2 text-sm">
			<div class="flex justify-between gap-3"><span>{t.tele}</span><strong>{score.teleIndependent}</strong></div>
			<div class="flex justify-between gap-3"><span>{t.shared}</span><strong>{score.sharedScore}</strong></div>
			<div class="flex justify-between gap-3"><span>{t.endgame}</span><strong>{score.endgame}</strong></div>
			<div class="flex justify-between gap-3"><span>{t.penalty}</span><strong>{score.penalties}</strong></div>
			<div class="flex justify-between gap-3"><span>{t.multiplier}</span><strong>x{score.multiplier}</strong></div>
			<div class="mt-3 flex justify-between gap-3 border-t border-slate-200 pt-3 text-base dark:border-white/10">
				<span>{t.score}</span>
				<strong class="text-xl text-cyan-600 dark:text-cyan-400">{score.total}</strong>
			</div>
		</div>
	</div>
{/snippet}
