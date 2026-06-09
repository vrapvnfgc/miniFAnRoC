<script lang="ts">
    import Navbar from '$lib/components/layout/Navbar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import type { PageData } from './$types';
    import { getLocale } from '$lib/paraglide/runtime';
    import { Trophy, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-svelte';

    let { data }: { data: PageData } = $props();
    const locale = $derived(getLocale() as 'en' | 'vi');
    const text = $derived.by(() =>
        locale === 'vi'
            ? {
                title: 'Giải đấu',
                description: 'Theo dõi các giải đấu, lịch thi đấu và bảng điểm FAnRoC.',
                metaDescription: 'Danh sách giải đấu, lịch thi đấu và kết quả FAnRoC.',
                platform: 'Nền tảng FAnRoC',
                total: 'Tổng',
                active: 'Đang diễn ra',
                upcoming: 'Sắp diễn ra',
                completed: 'Đã kết thúc',
                emptyTitle: 'Chưa có giải đấu',
                emptyDescription: 'Vui lòng quay lại sau để xem các giải đấu sắp tới.',
                noDescription: 'Chưa có mô tả.'
            }
            : {
                title: 'Competitions',
                description: 'Follow FAnRoC competitions, match schedules, and scoreboards.',
                metaDescription: 'FAnRoC competition list, match schedules, and results.',
                platform: 'FAnRoC Platform',
                total: 'Total',
                active: 'Active',
                upcoming: 'Upcoming',
                completed: 'Completed',
                emptyTitle: 'No competitions yet',
                emptyDescription: 'Check back later for upcoming competitions.',
                noDescription: 'No description yet.'
            }
    );

    function getStatusConfig(status: string) {
        switch (status) {
            case 'upcoming':
                return {
                    label: text.upcoming,
                    classes: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
                    icon: Clock
                };
            case 'active':
                return {
                    label: text.active,
                    classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
                    icon: CheckCircle
                };
            case 'completed':
                return {
                    label: text.completed,
                    classes: 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
                    icon: Trophy
                };
            default:
                return {
                    label: status,
                    classes: 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
                    icon: Calendar
                };
        }
    }

    function formatDate(date: string | undefined): string {
        if (!date) return '—';
        return new Date(date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function formatDateRange(start: string | undefined, end: string | undefined): string {
        if (!start && !end) return '—';
        if (!end) return formatDate(start);
        if (!start) return formatDate(end);
        const s = new Date(start);
        const e = new Date(end);
        if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
            return `${s.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric' })} – ${e.getDate()}, ${e.getFullYear()}`;
        }
        return `${formatDate(start)} – ${formatDate(end)}`;
    }

    function localizedName(competition: any) {
        return (locale === 'vi' ? competition.nameVi : competition.nameEn) || competition.name;
    }

    function localizedDescription(competition: any) {
        return (
            (locale === 'vi' ? competition.descriptionVi : competition.descriptionEn) ||
            competition.description
        );
    }
</script>

<svelte:head>
    <title>{text.title} · miniFAnRoC</title>
    <meta name="description" content={text.metaDescription} />
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
        <div class="mb-10 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-10">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p class="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-400">
                        {text.platform}
                    </p>
                    <h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        {text.title}
                    </h1>
                    <p class="mt-3 text-base text-slate-500 dark:text-slate-400">
                        {text.description}
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <div class="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-center dark:border-white/10 dark:bg-slate-800/60">
                        <p class="text-2xl font-black text-slate-900 dark:text-white">{data.competitions.length}</p>
                        <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{text.total}</p>
                    </div>
                    <div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
                        <p class="text-2xl font-black text-emerald-700 dark:text-emerald-400">{data.competitions.filter(c => c.status === 'active').length}</p>
                        <p class="text-xs font-medium text-emerald-600 dark:text-emerald-400">{text.active}</p>
                    </div>
                    <div class="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-center dark:border-blue-500/20 dark:bg-blue-500/10">
                        <p class="text-2xl font-black text-blue-700 dark:text-blue-400">{data.competitions.filter(c => c.status === 'upcoming').length}</p>
                        <p class="text-xs font-medium text-blue-600 dark:text-blue-400">{text.upcoming}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error -->
        {#if data.error}
            <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <p class="font-semibold">{data.error}</p>
            </div>
        {/if}

        <!-- Empty state -->
        {#if data.competitions.length === 0}
            <div class="rounded-[32px] border border-dashed border-slate-300 bg-white/60 p-16 text-center backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Trophy class="h-7 w-7 text-slate-400" />
                </div>
                <p class="text-lg font-semibold text-slate-700 dark:text-slate-300">{text.emptyTitle}</p>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{text.emptyDescription}</p>
            </div>

        {:else}
            <!-- Competition cards -->
            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {#each data.competitions as competition (competition.id)}
                    {@const cfg = getStatusConfig(competition.status)}
                    <a
                        href={`/competitions/${competition.id}`}
                        class="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900/80 dark:hover:shadow-cyan-500/10"
                    >
                        <!-- Status badge -->
                        <div class="mb-4 flex items-center justify-between">
                            <span class={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.classes}`}>
                                <svelte:component this={cfg.icon} class="h-3.5 w-3.5" />
                                {cfg.label}
                            </span>
                            <div class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 transition group-hover:border-cyan-300 group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:border-white/10 dark:bg-slate-800 dark:group-hover:border-cyan-500/30 dark:group-hover:bg-cyan-500/10 dark:group-hover:text-cyan-400">
                                <ArrowRight class="h-3.5 w-3.5" />
                            </div>
                        </div>

                        <!-- Name -->
                        <h2 class="mb-2 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
                            {localizedName(competition)}
                        </h2>

                        <!-- Description -->
                        {#if localizedDescription(competition)}
                            <p class="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                {localizedDescription(competition)}
                            </p>
                        {:else}
                            <p class="mb-4 flex-1 text-sm italic text-slate-400 dark:text-slate-600">{text.noDescription}</p>
                        {/if}

                        <!-- Date range -->
                        <div class="mt-auto flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-white/5 dark:bg-slate-800/60">
                            <Calendar class="h-4 w-4 shrink-0 text-cyan-500 dark:text-cyan-400" />
                            <span class="text-xs font-medium text-slate-600 dark:text-slate-300">
                                {formatDateRange(competition.startDate, competition.endDate)}
                            </span>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</section>

<Footer />
