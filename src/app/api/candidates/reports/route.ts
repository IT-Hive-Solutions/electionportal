
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { ReportFilters, fetchReportData } from '@/core/services/fetch-report-data';

const getCachedReportData = unstable_cache(
    async (filters: ReportFilters) => fetchReportData(filters),
    ['report-data'],
    {
        revalidate: 300, // 5 minutes
        tags: ['reports'],
    }
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const filters: ReportFilters = {
        province: searchParams.get('province') ?? undefined,
        district: searchParams.get('district') ?? undefined,
        constituency: searchParams.get('constituency') ?? undefined,
        party: searchParams.get('party') ?? undefined,
        election: searchParams.get('election') ? Number(searchParams.get('election')) : undefined,
    };

    try {
        const data = await getCachedReportData(filters);
        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
        });
    } catch (error) {
        console.error('[Reports API]', error);
        return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
    }
}