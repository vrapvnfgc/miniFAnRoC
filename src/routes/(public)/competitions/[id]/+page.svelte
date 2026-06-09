<script lang="ts">
    import Navbar from '$lib/components/layout/Navbar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { api } from '$lib/api';
    import { getLocale } from '$lib/paraglide/runtime';
    import type { MatchScoreResponse } from '$lib/api/scores.api';
    import { Trophy, Users, Swords, BarChart3, Calendar, Clock, Award, ArrowUpRight } from 'lucide-svelte';

    let { data }: { data: PageData } = $props();
    const locale = $derived(getLocale() as 'en' | 'vi');
    const text = $derived.by(() =>
        locale === 'vi'
            ? {
                competition: 'Giải đấu',
                defaultMeta: 'Thông tin giải đấu, đội thi, trận đấu và bảng xếp hạng.',
                backToCompetitions: 'Tất cả giải đấu',
                competitionInfo: 'Thông tin giải đấu',
                teams: 'Đội thi',
                matches: 'Trận đấu',
                rankings: 'Xếp hạng',
                awardReport: 'Báo cáo giải thưởng',
                advanceReport: 'Báo cáo thăng hạng',
                teamUnit: 'đội',
                matchUnit: 'trận',
                unknownTeam: 'Không rõ đội',
                unknownField: 'Không rõ sân',
                noTeams: 'Chưa có đội đăng ký.',
                noMatches: 'Chưa có trận đấu.',
                teamNumber: 'Mã đội',
                teamName: 'Tên đội',
                school: 'Trường',
                results: 'Kết quả',
                upcoming: 'Sắp diễn ra',
                noDate: 'Chưa có',
                unscheduled: 'Chưa xếp lịch',
                redAlliance: 'Liên minh đỏ',
                blueAlliance: 'Liên minh xanh',
                score: 'Điểm',
                viewDetails: 'Xem chi tiết',
                loadingRankings: 'Đang tải bảng xếp hạng...',
                noRankings: 'Chưa có bảng xếp hạng.',
                rank: 'Hạng',
                code: 'Mã',
                team: 'Đội',
                played: 'Trận',
                highest: 'Cao nhất',
                awardReportIntro: 'Báo cáo này tổng hợp gợi ý trao giải dựa trên bảng xếp hạng hiện tại của giải đấu. BTC có thể dùng làm cơ sở rà soát và cập nhật kết quả chính thức.',
                rankingScore: 'Điểm xếp hạng',
                countedMatches: 'Trận đã tính',
                insufficientData: 'Chưa đủ dữ liệu',
                advanceIntroPrefix: 'Giải này thăng cấp lên',
                higherCompetition: 'giải cấp cao hơn',
                advanceIntro: 'Playoff FAnRoC có 6 liên minh, mỗi liên minh gồm 2 đội. Mỗi liên minh đấu 5 trận để gặp đủ 5 liên minh còn lại; màu liên minh và thứ tự sân là ngẫu nhiên, không ràng buộc. Bảng xếp hạng playoff được tính theo tổng điểm tích lũy của liên minh, tương tự cách xếp hạng vòng loại nhưng áp dụng cho liên minh thay vì từng đội.',
                noAdvanceData: 'Chưa có dữ liệu playoff để lập báo cáo thăng hạng.',
                noAdvanceHint: 'BTC cần cập nhật các trận playoff và điểm số để hệ thống xác định 4 liên minh thăng hạng.',
                alliance: 'Liên minh',
                playoffScore: 'Điểm',
                total: 'Tổng',
                status: 'Trạng thái',
                advanced: 'Thăng hạng',
                reserve: 'Dự bị',
                matchDetails: 'Chi tiết trận đấu',
                close: 'Đóng',
                teleIndependent: 'Tele độc lập',
                shared: 'Điểm chung',
                penalties: 'Phạt',
                endgame: 'Endgame',
                endgameMultiplier: 'Hệ số endgame',
                awardDescriptions: [
                    'Đội có điểm xếp hạng cao nhất của giải đấu.',
                    'Đội có thành tích nổi bật tiếp theo trong bảng xếp hạng.',
                    'Gợi ý xét từ nhóm đội có hiệu suất cao; BTC có thể cập nhật theo tiêu chí kỹ thuật.',
                    'Gợi ý xét từ nhóm đội nổi bật; BTC có thể cập nhật theo tiêu chí tăng trưởng.'
                ]
            }
            : {
                competition: 'Competition',
                defaultMeta: 'Competition information, teams, matches, and rankings.',
                backToCompetitions: 'All competitions',
                competitionInfo: 'Competition information',
                teams: 'Teams',
                matches: 'Matches',
                rankings: 'Rankings',
                awardReport: 'Award report',
                advanceReport: 'Advance report',
                teamUnit: 'teams',
                matchUnit: 'matches',
                unknownTeam: 'Unknown team',
                unknownField: 'Unknown field',
                noTeams: 'No teams registered yet.',
                noMatches: 'No matches yet.',
                teamNumber: 'Team code',
                teamName: 'Team name',
                school: 'School',
                results: 'Results',
                upcoming: 'Upcoming',
                noDate: 'Not available',
                unscheduled: 'Not scheduled',
                redAlliance: 'Red alliance',
                blueAlliance: 'Blue alliance',
                score: 'Score',
                viewDetails: 'View details',
                loadingRankings: 'Loading rankings...',
                noRankings: 'No rankings yet.',
                rank: 'Rank',
                code: 'Code',
                team: 'Team',
                played: 'Matches',
                highest: 'Highest',
                awardReportIntro: 'This report summarizes suggested award candidates from the current competition rankings. Organizers can review and update official results as needed.',
                rankingScore: 'Ranking score',
                countedMatches: 'Counted matches',
                insufficientData: 'Not enough data',
                advanceIntroPrefix: 'This competition advances to',
                higherCompetition: 'a higher-level competition',
                advanceIntro: 'FAnRoC playoffs have 6 alliances, each with 2 teams. Each alliance plays 5 matches to face the other 5 alliances; alliance color and field order are random and not constrained. Playoff ranking uses each alliance total accumulated score, similar to qualification ranking but applied to alliances instead of individual teams.',
                noAdvanceData: 'No playoff data is available for the advance report yet.',
                noAdvanceHint: 'Organizers need to update playoff matches and scores so the system can identify the 4 advancing alliances.',
                alliance: 'Alliance',
                playoffScore: 'Score',
                total: 'Total',
                status: 'Status',
                advanced: 'Advanced',
                reserve: 'Reserve',
                matchDetails: 'Match details',
                close: 'Close',
                teleIndependent: 'Tele Independent',
                shared: 'Shared',
                penalties: 'Penalties',
                endgame: 'Endgame',
                endgameMultiplier: 'Endgame Multiplier',
                awardDescriptions: [
                    'Team with the highest ranking score in this competition.',
                    'Next outstanding team in the rankings.',
                    'Suggested from high-performing teams; organizers may update this using technical criteria.',
                    'Suggested from notable teams; organizers may update this using growth criteria.'
                ]
            }
    );

    let matchScores = $state<Record<string, { redScore: number; blueScore: number }>>({});
    let selectedMatchId: string | null = $state(null);
    let selectedMatchDetails: { match?: any; score?: MatchScoreResponse | null } | null = $state(null);
    let rankings = $state<any[]>([]);
    let rankingsLoading = $state(false);
    let activeTab = $state<'teams' | 'matches' | 'rankings' | 'awards' | 'advance'>('teams');

    $effect(() => {
        rankings = data?.rankings || [];
    });

    function getTeamName(teamId: string) {
        const team = (data.teams || []).find((t: any) => t.id === teamId);
        return team ? `${team.teamNumber} - ${team.name}` : text.unknownTeam;
    }

    async function navigateToTeam(teamId: string) {
        const team = (data.teams || []).find((t: any) => t.id === teamId);
        if (team) await goto(`/teams/${team.teamNumber}`);
    }

    function getFieldName(fieldId: string) {
        const field = (data.fields || []).find((f: any) => f.id === fieldId);
        return field ? field.name : text.unknownField;
    }

    const finishedMatches = $derived.by(() => {
        return (data.matches || []).filter((m: any) => m.status === 'finished').sort((a: any, b: any) => {
            return new Date(b.endTime || b.updatedAt).getTime() - new Date(a.endTime || a.updatedAt).getTime();
        });
    });

    const unplayedMatches = $derived.by(() => {
        return (data.matches || []).filter((m: any) => m.status !== 'finished').sort((a: any, b: any) => {
            if (!a.scheduledTime && !b.scheduledTime) return 0;
            if (!a.scheduledTime) return 1;
            if (!b.scheduledTime) return -1;
            return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
        });
    });

    async function loadScores() {
        const scores: Record<string, { redScore: number; blueScore: number }> = {};
        for (const match of finishedMatches) {
            try {
                const scoreRes = await api.scores.getByMatchId(match.id);
                if (scoreRes.data?.score) {
                    scores[match.id] = {
                        redScore: scoreRes.data.score.red.total || 0,
                        blueScore: scoreRes.data.score.blue.total || 0
                    };
                } else {
                    scores[match.id] = { redScore: 0, blueScore: 0 };
                }
            } catch {
                scores[match.id] = { redScore: 0, blueScore: 0 };
            }
        }
        matchScores = scores;
    }

    function getScoreDisplay(matchId: string) {
        const s = matchScores[matchId];
        if (!s) return '—';
        return `${s.redScore} — ${s.blueScore}`;
    }

    function getAwardRows() {
        const awardCatalog = {
            fanroc_excellence: {
                title: 'FAnRoC Excellence Award',
                description: text.awardDescriptions[0]
            },
            outstanding: {
                title: 'Outstanding Award',
                description: text.awardDescriptions[1]
            },
            innovation: {
                title: 'Innovation Award',
                description: text.awardDescriptions[2]
            },
            rising_star: {
                title: 'Rising Star Award',
                description: text.awardDescriptions[3]
            }
        };

        if (data.awardReport?.awards?.length) {
            return data.awardReport.awards.map((award: any) => ({
                ...awardCatalog[award.awardKey as keyof typeof awardCatalog],
                team: award.ranking || null
            }));
        }

        return Object.values(awardCatalog).map((award, index) => ({
            ...award,
            team: rankings[index] || null
        }));
    }

    function allianceKey(teamIds: string[]) {
        return [...teamIds].sort().join('|');
    }

    function getAdvanceRows() {
        if (data.advanceReport?.alliances?.length) {
            return data.advanceReport.alliances;
        }

        const allianceMap = new Map<
            string,
            {
                teamIds: string[];
                matchesPlayed: number;
                totalScore: number;
                highestScore: number;
            }
        >();

        for (const match of finishedMatches.filter((item: any) => item.phase === 'playoff')) {
            const score = matchScores[match.id];
            if (!score) continue;

            for (const entry of [
                { teamIds: match.redTeamIds, score: score.redScore },
                { teamIds: match.blueTeamIds, score: score.blueScore }
            ]) {
                const key = allianceKey(entry.teamIds);
                const current =
                    allianceMap.get(key) ||
                    {
                        teamIds: entry.teamIds,
                        matchesPlayed: 0,
                        totalScore: 0,
                        highestScore: 0
                    };

                current.matchesPlayed += 1;
                current.totalScore += entry.score;
                current.highestScore = Math.max(current.highestScore, entry.score);
                allianceMap.set(key, current);
            }
        }

        return Array.from(allianceMap.values())
            .map((alliance) => ({
                ...alliance,
                rankingScore: alliance.totalScore,
                averageScore: alliance.matchesPlayed > 0 ? alliance.totalScore / alliance.matchesPlayed : 0
            }))
            .sort((a, b) => {
                if (b.rankingScore !== a.rankingScore) return b.rankingScore - a.rankingScore;
                if (b.highestScore !== a.highestScore) return b.highestScore - a.highestScore;
                return allianceKey(a.teamIds).localeCompare(allianceKey(b.teamIds));
            })
            .map((alliance, index) => ({
                ...alliance,
                rank: index + 1,
                status: index < 4 ? 'advanced' : 'reserve'
            }));
    }

    function getAllianceTeams(alliance: any) {
        if (alliance.teams?.length) return alliance.teams;
        return (alliance.teamIds || []).map((teamId: string) => ({ teamId }));
    }

    function getAllianceTeamLabel(team: any) {
        return team.teamNumber && team.teamName
            ? `${team.teamNumber} - ${team.teamName}`
            : getTeamName(team.teamId);
    }

    async function openDetails(match: any) {
        selectedMatchId = match.id;
        selectedMatchDetails = null;
        try {
            const res = await api.scores.getByMatchId(match.id);
            selectedMatchDetails = { match, score: res.data?.score || null };
        } catch {
            selectedMatchDetails = { match, score: null };
        }
    }

    function closeDetails() {
        selectedMatchId = null;
        selectedMatchDetails = null;
    }

    async function loadRankings() {
        if (!data?.competition?.id) return;
        rankingsLoading = true;
        try {
            const res = await api.competitions.getRankings(data.competition.id, true);
            rankings = res.data?.rankings || [];
        } catch {
            rankings = [];
        } finally {
            rankingsLoading = false;
        }
    }

    onMount(async () => {
        await loadScores();
        if ((rankings || []).length === 0) await loadRankings();
    });

    function formatMatchId(match: any) {
        return `${match.phase.toUpperCase()}-${String(match.matchNumber).padStart(2, '0')}`;
    }

    function formatDateTime(date: string | undefined) {
        if (!date) return text.noDate;
        return new Date(date).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US');
    }

    function formatDate(date: string | undefined) {
        if (!date) return text.noDate;
        return new Date(date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function localizedCompetitionName(competition: any | undefined) {
        if (!competition) return text.competition;
        return (locale === 'vi' ? competition.nameVi : competition.nameEn) || competition.name;
    }

    function localizedCompetitionDescription(competition: any | undefined) {
        if (!competition) return '';
        return (
            (locale === 'vi' ? competition.descriptionVi : competition.descriptionEn) ||
            competition.description ||
            ''
        );
    }

    const tabs = $derived.by(() => [
        { id: 'teams', label: text.teams, icon: Users },
        { id: 'matches', label: text.matches, icon: Swords },
        { id: 'rankings', label: text.rankings, icon: BarChart3 },
        { id: 'awards', label: text.awardReport, icon: Award },
        ...(data.competition?.nextCompetitionId
            ? [{ id: 'advance' as const, label: text.advanceReport, icon: ArrowUpRight }]
            : [])
    ] as const);
</script>

<svelte:head>
    <title>{localizedCompetitionName(data.competition)} · miniFAnRoC</title>
    <meta name="description" content={localizedCompetitionDescription(data.competition) || text.defaultMeta} />
</svelte:head>

<Navbar />

<section class="relative overflow-hidden bg-slate-50 py-20 dark:bg-slate-950">
    <!-- Ambient blobs -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div class="absolute right-0 top-20 h-60 w-60 rounded-full bg-purple-400/10 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl"></div>
    </div>

    <div class="mx-auto max-w-6xl px-6">

        <!-- Header card -->
        <div class="mb-8 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-10">
            <div class="flex flex-col gap-4">
                <a href="/competitions" class="inline-flex w-fit items-center gap-1.5 text-xs font-semibold tracking-[0.15em] text-cyan-600 uppercase transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300">
                    ← {text.backToCompetitions}
                </a>
                <div>
                    <p class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
                        {text.competitionInfo}
                    </p>
                    <h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        {localizedCompetitionName(data.competition)}
                    </h1>
                    {#if localizedCompetitionDescription(data.competition)}
                        <p class="mt-3 text-base text-slate-500 dark:text-slate-400">{localizedCompetitionDescription(data.competition)}</p>
                    {/if}
                </div>

                <!-- Stats row -->
                <div class="mt-2 flex flex-wrap gap-3">
                    <div class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-slate-800/60">
                        <Users class="h-4 w-4 text-cyan-500" />
                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{data.teams?.length || 0} {text.teamUnit}</span>
                    </div>
                    <div class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-slate-800/60">
                        <Swords class="h-4 w-4 text-purple-500" />
                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{data.matches?.length || 0} {text.matchUnit}</span>
                    </div>
                    {#if data.competition?.startDate}
                        <div class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-slate-800/60">
                            <Calendar class="h-4 w-4 text-emerald-500" />
                            <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {formatDate(data.competition.startDate)}
                            </span>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        {#if data.error}
            <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <p class="font-semibold">{data.error}</p>
            </div>
        {/if}

        <!-- Tab nav + content card -->
        <div class="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-8">

            <!-- Tab buttons -->
            <div class="mb-8 flex flex-wrap gap-2">
                {#each tabs as tab}
                    <button
                        type="button"
                        onclick={() => (activeTab = tab.id)}
                        class={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                    >
                        <svelte:component this={tab.icon} class="h-4 w-4" />
                        {tab.label}
                    </button>
                {/each}
            </div>

            <!-- TEAMS TAB -->
            {#if activeTab === 'teams'}
                {#if data.teams.length === 0}
                    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center dark:border-white/10 dark:bg-slate-800/40">
                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                            <Users class="h-7 w-7 text-slate-400" />
                        </div>
                        <p class="font-semibold text-slate-600 dark:text-slate-300">{text.noTeams}</p>
                    </div>
                {:else}
                    <div class="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
                        <!-- Table header -->
                        <div class="grid grid-cols-[3rem_1fr_2fr_2fr] gap-0 border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-slate-800/60">
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">#</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.teamNumber}</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.teamName}</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.school}</span>
                        </div>
                        {#each data.teams as team, i (team.id)}
                            <button
                                type="button"
                                onclick={() => goto(`/teams/${team.teamNumber}`)}
                                class="grid w-full grid-cols-[3rem_1fr_2fr_2fr] items-center gap-0 border-b border-slate-100 px-5 py-4 text-left transition-colors last:border-0 hover:bg-cyan-50 dark:border-white/5 dark:hover:bg-cyan-500/5"
                            >
                                <span class="text-sm text-slate-400 dark:text-slate-500">{i + 1}</span>
                                <span class="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">{team.teamNumber}</span>
                                <span class="text-sm font-semibold text-slate-900 transition group-hover:text-cyan-600 dark:text-white">{team.name}</span>
                                <span class="text-sm text-slate-500 dark:text-slate-400">{team.school || '—'}</span>
                            </button>
                        {/each}
                    </div>
                {/if}

            <!-- MATCHES TAB -->
            {:else if activeTab === 'matches'}
                {#if data.matches.length === 0}
                    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center dark:border-white/10 dark:bg-slate-800/40">
                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                            <Swords class="h-7 w-7 text-slate-400" />
                        </div>
                        <p class="font-semibold text-slate-600 dark:text-slate-300">{text.noMatches}</p>
                    </div>
                {:else}
                    <div class="space-y-8">
                        <!-- Finished matches -->
                        {#if finishedMatches.length > 0}
                            <div>
                                <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{text.results}</p>
                                <div class="grid gap-4 md:grid-cols-2">
                                    {#each finishedMatches as match}
                                        <article class="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-800/40">
                                            <div class="mb-4 flex items-center justify-between gap-3">
                                                <span class="font-mono text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{formatMatchId(match)}</span>
                                                <div class="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 shadow-sm dark:bg-slate-700 dark:text-slate-300">
                                                    {getFieldName(match.fieldId)}
                                                </div>
                                            </div>
                                            <p class="mb-4 text-xs text-slate-400 dark:text-slate-500">
                                                {formatDateTime(match.endTime)}
                                            </p>

                                            <div class="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-center">
                                                <div class="rounded-2xl border border-slate-200 bg-white p-4 transition dark:border-white/5 dark:bg-slate-900/60">
                                                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">{text.redAlliance}</p>
                                                    <div class="mt-2 space-y-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                        {#each match.redTeamIds as teamId}
                                                            <button type="button" onclick={() => navigateToTeam(teamId)} class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400">{getTeamName(teamId)}</button>
                                                        {/each}
                                                    </div>
                                                </div>

                                                <div class="flex flex-col items-center justify-center gap-1 rounded-2xl bg-slate-900 px-4 py-5 text-white dark:bg-white/10">
                                                    <p class="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-300">{text.score}</p>
                                                    <p class="text-xl font-black">{getScoreDisplay(match.id)}</p>
                                                </div>

                                                <div class="rounded-2xl border border-slate-200 bg-white p-4 transition dark:border-white/5 dark:bg-slate-900/60">
                                                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">{text.blueAlliance}</p>
                                                    <div class="mt-2 space-y-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                        {#each match.blueTeamIds as teamId}
                                                            <button type="button" onclick={() => navigateToTeam(teamId)} class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400">{getTeamName(teamId)}</button>
                                                        {/each}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onclick={() => openDetails(match)}
                                                class="mt-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20"
                                            >
                                                {text.viewDetails}
                                            </button>
                                        </article>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        <!-- Upcoming matches -->
                        {#if unplayedMatches.length > 0}
                            <div>
                                <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{text.upcoming}</p>
                                <div class="grid gap-4 md:grid-cols-2">
                                    {#each unplayedMatches as match}
                                        <article class="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-800/40">
                                            <div class="mb-4 flex items-center justify-between gap-3">
                                                <span class="font-mono text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{formatMatchId(match)}</span>
                                                <div class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                    <Clock class="h-3.5 w-3.5" />
                                                    <span>{match.scheduledTime ? formatDateTime(match.scheduledTime) : text.unscheduled}</span>
                                                </div>
                                            </div>
                                            <div class="grid gap-3 sm:grid-cols-2">
                                                <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-slate-900/60">
                                                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">{text.redAlliance}</p>
                                                    <div class="mt-2 space-y-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                        {#each match.redTeamIds as teamId}
                                                            <button type="button" onclick={() => navigateToTeam(teamId)} class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400">{getTeamName(teamId)}</button>
                                                        {/each}
                                                    </div>
                                                </div>
                                                <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-slate-900/60">
                                                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">{text.blueAlliance}</p>
                                                    <div class="mt-2 space-y-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                        {#each match.blueTeamIds as teamId}
                                                            <button type="button" onclick={() => navigateToTeam(teamId)} class="block text-left transition hover:text-cyan-600 dark:hover:text-cyan-400">{getTeamName(teamId)}</button>
                                                        {/each}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/if}

            <!-- RANKINGS TAB -->
            {:else if activeTab === 'rankings'}
                {#if rankingsLoading}
                    <div class="py-12 text-center text-slate-500 dark:text-slate-400">{text.loadingRankings}</div>
                {:else if rankings.length === 0}
                    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center dark:border-white/10 dark:bg-slate-800/40">
                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                            <BarChart3 class="h-7 w-7 text-slate-400" />
                        </div>
                        <p class="font-semibold text-slate-600 dark:text-slate-300">{text.noRankings}</p>
                    </div>
                {:else}
                    <div class="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
                        <!-- Table header -->
                        <div class="grid grid-cols-[3.5rem_3.5rem_1fr_5rem_5rem_6rem] gap-0 border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-slate-800/60">
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.rank}</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.code}</span>
                            <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.team}</span>
                            <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.played}</span>
                            <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.score}</span>
                            <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.highest}</span>
                        </div>
                        {#each rankings as r, i}
                            <button
                                type="button"
                                onclick={() => goto(`/teams/${r.teamNumber}`)}
                                class={`grid w-full grid-cols-[3.5rem_3.5rem_1fr_5rem_5rem_6rem] items-center gap-0 border-b border-slate-100 px-5 py-4 text-left transition-colors last:border-0 hover:bg-cyan-50 dark:border-white/5 dark:hover:bg-cyan-500/5 ${i === 0 ? 'bg-amber-50/60 dark:bg-amber-500/5' : ''}`}
                            >
                                <span class={`text-sm font-black ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : r.rank}
                                </span>
                                <span class="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">{r.teamNumber}</span>
                                <span class="text-sm font-semibold text-slate-900 dark:text-white">{r.teamName}</span>
                                <span class="text-right text-sm text-slate-500 dark:text-slate-400">{r.matchesPlayed}</span>
                                <span class="text-right text-sm font-bold text-slate-700 dark:text-slate-200">{r.rankingScore}</span>
                                <span class="text-right text-sm text-slate-500 dark:text-slate-400">{r.highestMatchScore}</span>
                            </button>
                        {/each}
                    </div>
                {/if}
            {:else if activeTab === 'awards'}
                <div class="space-y-5">
                    <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-800/40">
                        <p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{text.awardReport}</p>
                        <h2 class="mt-2 text-2xl font-black text-slate-900 dark:text-white">{text.awardReport}</h2>
                        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {text.awardReportIntro}
                        </p>
                    </div>

                    <div class="grid gap-4 md:grid-cols-2">
                        {#each getAwardRows() as award}
                            <article class="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70">
                                <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">{award.title}</p>
                                <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{award.description}</p>
                                <div class="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
                                    {#if award.team}
                                        <p class="text-sm font-semibold text-slate-900 dark:text-white">
                                            #{award.team.rank} · {award.team.teamNumber} - {award.team.teamName}
                                        </p>
                                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {text.rankingScore}: {award.team.rankingScore} · {text.countedMatches}: {award.team.matchesPlayed}
                                        </p>
                                    {:else}
                                        <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{text.insufficientData}</p>
                                    {/if}
                                </div>
                            </article>
                        {/each}
                    </div>
                </div>
            {:else if activeTab === 'advance'}
                {@const advanceRows = getAdvanceRows()}
                <div class="space-y-5">
                    <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-800/40">
                        <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">{text.advanceReport}</p>
                        <h2 class="mt-2 text-2xl font-black text-slate-900 dark:text-white">{text.advanceReport}</h2>
                        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {text.advanceIntroPrefix} <span class="font-semibold text-slate-800 dark:text-slate-200">{data.nextCompetition ? localizedCompetitionName(data.nextCompetition) : text.higherCompetition}</span>.
                            {text.advanceIntro}
                        </p>
                    </div>

                    {#if advanceRows.length === 0}
                        <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-white/10 dark:bg-slate-800/40">
                            <p class="font-semibold text-slate-600 dark:text-slate-300">{text.noAdvanceData}</p>
                            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{text.noAdvanceHint}</p>
                        </div>
                    {:else}
                        <div class="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
                            <div class="grid grid-cols-[4rem_1fr_5rem_6rem_6rem_7rem] gap-0 border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-slate-800/60">
                                <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.rank}</span>
                                <span class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.alliance}</span>
                                <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.played}</span>
                                <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.playoffScore}</span>
                                <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.highest}</span>
                                <span class="text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{text.status}</span>
                            </div>
                            {#each advanceRows as alliance, index}
                                <div class="grid grid-cols-[4rem_1fr_5rem_6rem_6rem_7rem] items-center gap-0 border-b border-slate-100 px-5 py-4 last:border-0 dark:border-white/5">
                                    <span class="text-sm font-black text-slate-700 dark:text-slate-200">#{alliance.rank || index + 1}</span>
                                    <div class="text-sm font-semibold text-slate-900 dark:text-white">
                                        {#each getAllianceTeams(alliance) as team, teamIndex}
                                            <button type="button" onclick={() => navigateToTeam(team.teamId)} class="transition hover:text-cyan-600 dark:hover:text-cyan-400">
                                                {getAllianceTeamLabel(team)}
                                            </button>{teamIndex < getAllianceTeams(alliance).length - 1 ? ' + ' : ''}
                                        {/each}
                                    </div>
                                    <span class="text-right text-sm text-slate-500 dark:text-slate-400">{alliance.matchesPlayed}</span>
                                    <span class="text-right text-sm font-bold text-slate-700 dark:text-slate-200">{alliance.rankingScore ?? alliance.totalScore}</span>
                                    <span class="text-right text-sm text-slate-500 dark:text-slate-400">{alliance.highestScore}</span>
                                    <span class={`text-right text-xs font-bold uppercase tracking-wide ${alliance.status === 'advanced' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                        {alliance.status === 'advanced' ? text.advanced : text.reserve}
                                    </span>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}

        </div>
    </div>
</section>

<!-- Score details modal -->
{#if selectedMatchId && selectedMatchDetails}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div class="max-h-screen w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:p-8">
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">{text.matchDetails}</p>
                    <h2 class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                        {selectedMatchDetails.match.phase.toUpperCase()}-{String(selectedMatchDetails.match.matchNumber).padStart(2, '0')}
                    </h2>
                </div>
                <button
                    onclick={closeDetails}
                    title={text.close}
                    class="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-800/60">
                <div class="grid gap-6 sm:grid-cols-2">
                    <!-- Red Alliance -->
                    <div>
                        <h3 class="mb-3 text-sm font-bold text-red-600 dark:text-red-400">{text.redAlliance}</h3>
                        <div class="space-y-2 text-sm">
                            {#each [[text.teleIndependent, selectedMatchDetails.score?.red.teleIndependent], [text.shared, selectedMatchDetails.score?.red.sharedScore], [text.penalties, selectedMatchDetails.score?.red.penalties], [text.endgame, selectedMatchDetails.score?.red.endgame], [text.endgameMultiplier, selectedMatchDetails.score?.red.endgameMultiplier]] as [label, val]}
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">{label}:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{val ?? text.noDate}</span>
                                </div>
                            {/each}
                            <div class="border-t border-slate-200 pt-2 dark:border-white/10">
                                <div class="flex justify-between">
                                    <span class="font-bold text-red-600 dark:text-red-400">{text.total}:</span>
                                    <span class="text-lg font-black text-red-600 dark:text-red-400">{selectedMatchDetails.score?.red.total ?? text.noDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Blue Alliance -->
                    <div>
                        <h3 class="mb-3 text-sm font-bold text-sky-600 dark:text-sky-400">{text.blueAlliance}</h3>
                        <div class="space-y-2 text-sm">
                            {#each [[text.teleIndependent, selectedMatchDetails.score?.blue.teleIndependent], [text.shared, selectedMatchDetails.score?.blue.sharedScore], [text.penalties, selectedMatchDetails.score?.blue.penalties], [text.endgame, selectedMatchDetails.score?.blue.endgame], [text.endgameMultiplier, selectedMatchDetails.score?.blue.endgameMultiplier]] as [label, val]}
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">{label}:</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{val ?? text.noDate}</span>
                                </div>
                            {/each}
                            <div class="border-t border-slate-200 pt-2 dark:border-white/10">
                                <div class="flex justify-between">
                                    <span class="font-bold text-sky-600 dark:text-sky-400">{text.total}:</span>
                                    <span class="text-lg font-black text-sky-600 dark:text-sky-400">{selectedMatchDetails.score?.blue.total ?? text.noDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<Footer />
