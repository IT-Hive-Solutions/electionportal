
import { createDirectus, rest, aggregate, readItems } from '@directus/sdk';
import { getDirectusClient } from '../lib/directus';

// ─── Directus Client ──────────────────────────────────────────────────────────

const directus = getDirectusClient();

// ─── Output Types (matching your mock data shape exactly) ─────────────────────

export type ReportFilters = {
  province?: string;     // province slug  e.g. 'bagmati'
  district?: string;     // district slug  e.g. 'kathmandu'
  constituency?: string; // constituency slug e.g. 'ktm-1'
  party?: string;        // party slug     e.g. 'congress'
  election?: number;     // election id    e.g. 1
};

export type GenderDistributionItem = {
  name: string;   // Nepali label e.g. 'पुरुष'
  value: number;
  color: string;
};

export type PartyWiseCandidateItem = {
  party: string;       // short_name from parties table
  candidates: number;
  color: string;       // color_code from parties table
};

export type AgeDistributionItem = {
  group: string;  // e.g. '२१-३०'
  count: number;
};

export type EducationDistributionItem = {
  name: string;
  value: number;
  color: string;
};

export type ReportSummary = {
  totalCandidates: number;
  totalParties: number;
  totalConstituencies: number;
  totalProvinces: number;
  totalWinners: number;
  totalIndependent: number;
};

export type ReportData = {
  summary: ReportSummary;
  genderDistribution: GenderDistributionItem[];
  partyWiseCandidates: PartyWiseCandidateItem[];
  ageDistribution: AgeDistributionItem[];
  educationDistribution: EducationDistributionItem[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const GENDER_META: Record<string, { name: string; color: string }> = {
  male: { name: 'पुरुष', color: '#003da5' },
  female: { name: 'महिला', color: '#c41e3a' },
  other: { name: 'अन्य', color: '#2d8659' },
};

// Fallback colors cycled through education groups
const EDUCATION_COLORS = ['#003da5', '#c41e3a', '#d4a574', '#8b6f47', '#2d8659', '#6b5b4a'];

// Age ranges with Nepali labels
const AGE_RANGES = [
  { group: '२१-३०', min: 21, max: 30 },
  { group: '३१-४०', min: 31, max: 40 },
  { group: '४१-५०', min: 41, max: 50 },
  { group: '५१-६०', min: 51, max: 60 },
  { group: '६०+', min: 61, max: 120 },
];

// ─── Internal Types ───────────────────────────────────────────────────────────

type AggregateCountResult = { count: { id: string | number } }[];
type GroupByCountResult = { count: { id: string | number } }[];

// ─── Filter Builder ───────────────────────────────────────────────────────────

/**
 * Builds a Directus filter object from ReportFilters.
 *
 * Province/district live deep in the relation chain:
 *   candidates.constituency (M2O)
 *     → constituencies.district (M2O)
 *       → district.province (M2O)
 *
 * Directus supports deep relational filters with nested object notation.
 */
function buildFilter(filters: ReportFilters): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if (filters.election) {
    filter['election'] = { _eq: filters.election };
  }

  // Build constituency deep filter incrementally
  // Most specific wins — constituency slug overrides district which overrides province
  if (filters.constituency && filters.constituency !== 'all') {
    filter['constituency'] = { slug: { _eq: filters.constituency } };
  } else if (filters.district && filters.district !== 'all') {
    filter['constituency'] = { district: { slug: { _eq: filters.district } } };
  } else if (filters.province && filters.province !== 'all') {
    filter['constituency'] = {
      district: { province: { slug: { _eq: filters.province } } },
    };
  }

  if (filters.party && filters.party !== 'all') {
    filter['party'] = { slug: { _eq: filters.party } };
  }

  return filter;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchSummary(filters: ReportFilters): Promise<ReportSummary> {
  const filter = buildFilter(filters);

  const [
    totalResult,
    winnersResult,
    independentResult,
    partiesResult,
    constituenciesResult,
  ] = await Promise.all([
    // Total candidates
    directus.request(
      aggregate('candidates', {
        aggregate: { count: ['id'] },
        query: { filter },
      })
    ),
    // Winners
    directus.request(
      aggregate('candidates', {
        aggregate: { count: ['id'] },
        query: { filter: { ...filter, is_winner: { _eq: true } } },
      })
    ),
    // Independent candidates
    directus.request(
      aggregate('candidates', {
        aggregate: { count: ['id'] },
        query: { filter: { ...filter, independent_candidate: { _eq: true } } },
      })
    ),
    // Distinct parties — group by FK, measure array length
    directus.request(
      readItems('candidates', {
        groupBy: ['party'],
        aggregate: { count: ['id'] },
        filter,
        limit: -1,
      } as never)
    ),
    // Distinct constituencies — group by FK, measure array length
    directus.request(
      readItems('candidates', {
        groupBy: ['constituency'],
        aggregate: { count: ['id'] },
        filter,
        limit: -1,
      } as never)
    ),
  ]);

  // Province count: if filtered to a specific province it's 1, else fetch all
  const provincesResult = await directus.request(
    readItems('province', {
      fields: ['id'],
      limit: -1,
      ...(filters.province && filters.province !== 'all'
        ? { filter: { slug: { _eq: filters.province } } }
        : {}),
    } as never)
  ) as { id: number }[];

  return {
    totalCandidates: Number((totalResult as AggregateCountResult)[0]?.count?.id ?? 0),
    totalWinners: Number((winnersResult as AggregateCountResult)[0]?.count?.id ?? 0),
    totalIndependent: Number((independentResult as AggregateCountResult)[0]?.count?.id ?? 0),
    totalParties: (partiesResult as unknown[]).length,
    totalConstituencies: (constituenciesResult as unknown[]).length,
    totalProvinces: provincesResult.length,
  };
}

async function fetchGenderDistribution(
  filters: ReportFilters
): Promise<GenderDistributionItem[]> {
  const filter = buildFilter(filters);

  const result = await directus.request(
    readItems('candidates', {
      groupBy: ['gender'],
      aggregate: { count: ['id'] },
      filter,
      limit: -1,
    } as never)
  ) as Array<{ gender: string; count: { id: string | number } }>;

  return result.map((row) => ({
    name: GENDER_META[row.gender]?.name ?? row.gender,
    value: Number(row.count?.id ?? 0),
    color: GENDER_META[row.gender]?.color ?? '#999999',
  }));
}

async function fetchPartyWiseCandidates(
  filters: ReportFilters
): Promise<PartyWiseCandidateItem[]> {
  const filter = buildFilter(filters);

  // Two tiny queries: candidate counts grouped by party FK + full party list for metadata
  const [candidateCounts, allParties] = await Promise.all([
    directus.request(
      readItems('candidates', {
        groupBy: ['party'],
        aggregate: { count: ['id'] },
        filter,
        limit: -1,
      } as never)
    ) as Promise<Array<{ party: number | null; count: { id: string | number } }>>,

    directus.request(
      readItems('parties', {
        fields: ['id', 'name', 'short_name', 'slug', 'color_code'],
        limit: -1,
      } as never)
    ) as Promise<Array<{
      id: number;
      name: string;
      short_name: string;
      slug: string;
      color_code: string;
    }>>,
  ]);

  const partyMap = new Map(allParties.map((p) => [p.id, p]));

  return candidateCounts
    .filter((row) => row.party !== null) // exclude independent with no party FK
    .map((row) => {
      const info = partyMap.get(row.party as number);
      return {
        party: info?.short_name ?? info?.name ?? `Party ${row.party}`,
        candidates: Number(row.count?.id ?? 0),
        color: info?.color_code ?? '#999999',
      };
    })
    .sort((a, b) => b.candidates - a.candidates);
}

async function fetchAgeDistribution(
  filters: ReportFilters
): Promise<AgeDistributionItem[]> {
  const filter = buildFilter(filters);

  const results = await Promise.all(
    AGE_RANGES.map(({ min, max }) =>
      directus.request(
        aggregate('candidates', {
          aggregate: { count: ['id'] },
          query: {
            filter: {
              ...filter,
              age: { _gte: min, _lte: max },
            },
          },
        })
      )
    )
  );

  return AGE_RANGES.map(({ group }, i) => ({
    group,
    count: Number((results[i] as AggregateCountResult)[0]?.count?.id ?? 0),
  }));
}

async function fetchEducationDistribution(
  filters: ReportFilters
): Promise<EducationDistributionItem[]> {
  const filter = buildFilter(filters);

  const result = await directus.request(
    readItems('candidates', {
      groupBy: ['education'],
      aggregate: { count: ['id'] },
      filter,
      limit: -1,
    } as never)
  ) as Array<{ education: string | null; count: { id: string | number } }>;

  return result
    .filter((row) => row.education)
    .sort((a, b) => Number(b.count?.id ?? 0) - Number(a.count?.id ?? 0))
    .map((row, i) => ({
      name: row.education as string,
      value: Number(row.count?.id ?? 0),
      color: EDUCATION_COLORS[i % EDUCATION_COLORS.length],
    }));
}

export async function fetchReportData(filters: ReportFilters = {}): Promise<ReportData> {
  const [
    summary,
    genderDistribution,
    partyWiseCandidates,
    ageDistribution,
    educationDistribution,
  ] = await Promise.all([
    fetchSummary(filters),
    fetchGenderDistribution(filters),
    fetchPartyWiseCandidates(filters),
    fetchAgeDistribution(filters),
    fetchEducationDistribution(filters),
  ]);

  return {
    summary,
    genderDistribution,
    partyWiseCandidates,
    ageDistribution,
    educationDistribution,
  };
}