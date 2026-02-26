import { useState, useEffect, useRef, useCallback } from 'react';

const PAGE_SIZE = 6;

// ─── Types ────────────────────────────────────────────────────────────────────

export type DirectusCandidate = {
  id: number;
  full_name: string;
  slug: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  education: string | null;
  profession: string | null;
  previous_position: string | null;
  independent_candidate: boolean;
  is_winner: boolean;
  party: {
    id: number;
    name: string;
    short_name: string;
    slug: string;
    color_code: string;
    symbol: string;
  } | null;
  constituency: {
    id: number;
    name: string;
    slug: string;
    district: {
      id: number;
      name: string;
      slug: string;
      province: {
        id: number;
        name: string;
        slug: string;
      };
    };
  } | null;
};

export type FilterOption = { value: string; label: string };

export type CandidateFilters = {
  province: string;
  district: string;
  constituency: string;
  gender: string;
  party: string;
};

// ─── Proxy fetcher helper ─────────────────────────────────────────────────────

async function proxyFetch<T>(collection: string, params: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  const url = new URL(`/api/proxy/${collection}`, window.location.origin);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  }

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

// ─── Hook: filter options (provinces, districts, constituencies, parties) ─────

export function useFilterOptions(selectedProvince: string, selectedDistrict: string) {
  const [provinces, setProvinces] = useState<FilterOption[]>([{ value: 'all', label: 'सबै प्रदेश' }]);
  const [districts, setDistricts] = useState<FilterOption[]>([{ value: 'all', label: 'सबै जिल्ला' }]);
  const [constituencies, setConstituencies] = useState<FilterOption[]>([
    { value: 'all', label: 'सबै निर्वाचन क्षेत्र' },
  ]);
  const [parties, setParties] = useState<FilterOption[]>([{ value: 'all', label: 'सबै दल' }]);

  // Load provinces once
  useEffect(() => {
    proxyFetch<{ id: number; name: string; slug: string }[]>('province', {
      fields: 'id,name,slug',
      sort: 'order',
      limit: -1,
    })
      .then((data) => {
        setProvinces([{ value: 'all', label: 'सबै प्रदेश' }, ...data.map((p) => ({ value: p.slug, label: p.name }))]);
      })
      .catch(console.error);
  }, []);

  // Load parties once
  useEffect(() => {
    proxyFetch<{ id: number; name: string; short_name: string; slug: string }[]>('parties', {
      fields: 'id,name,short_name,slug',
      sort: 'priority',
      limit: -1,
    })
      .then((data) => {
        setParties([
          { value: 'all', label: 'सबै दल' },
          ...data.map((p) => ({
            value: p.slug,
            label: p.name,
          })),
        ]);
      })
      .catch(console.error);
  }, []);

  // Load districts when province changes
  useEffect(() => {
    setDistricts([{ value: 'all', label: 'सबै जिल्ला' }]);
    setConstituencies([{ value: 'all', label: 'सबै निर्वाचन क्षेत्र' }]);

    if (!selectedProvince || selectedProvince === 'all') return;

    proxyFetch<{ id: number; name: string; slug: string }[]>('district', {
      fields: 'id,name,slug',
      filter: JSON.stringify({
        province: { slug: { _eq: selectedProvince } },
      }),
      sort: 'order',
      limit: -1,
    })
      .then((data) => {
        setDistricts([{ value: 'all', label: 'सबै जिल्ला' }, ...data.map((d) => ({ value: d.slug, label: d.name }))]);
      })
      .catch(console.error);
  }, [selectedProvince]);

  // Load constituencies when district changes
  useEffect(() => {
    setConstituencies([{ value: 'all', label: 'सबै निर्वाचन क्षेत्र' }]);

    if (!selectedDistrict || selectedDistrict === 'all') return;

    proxyFetch<{ id: number; name: string; slug: string }[]>('constituencies', {
      fields: 'id,name,slug',
      filter: JSON.stringify({
        district: { slug: { _eq: selectedDistrict } },
      }),
      sort: 'name',
      limit: -1,
    })
      .then((data) => {
        setConstituencies([
          { value: 'all', label: 'सबै निर्वाचन क्षेत्र' },
          ...data.map((c) => ({ value: c.slug, label: c.name })),
        ]);
      })
      .catch(console.error);
  }, [selectedDistrict]);

  return { provinces, districts, constituencies, parties };
}

// ─── Hook: candidates with filter + pagination ────────────────────────────────

export function useCandidatesSearch(filters: CandidateFilters) {
  const [candidates, setCandidates] = useState<DirectusCandidate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Build Directus filter from active filters
  function buildFilter(f: CandidateFilters): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (f.constituency && f.constituency !== 'all') {
      filter['constituency'] = { slug: { _eq: f.constituency } };
    } else if (f.district && f.district !== 'all') {
      filter['constituency'] = {
        district: { slug: { _eq: f.district } },
      };
    } else if (f.province && f.province !== 'all') {
      filter['constituency'] = {
        district: { province: { slug: { _eq: f.province } } },
      };
    }

    if (f.gender && f.gender !== 'all') {
      filter['gender'] = { _eq: f.gender };
    }

    if (f.party && f.party !== 'all') {
      filter['party'] = { slug: { _eq: f.party } };
    }

    return filter;
  }

  const FIELDS = [
    'id',
    'full_name',
    'slug',
    'gender',
    'age',
    'education',
    'profession',
    'previous_position',
    'independent_candidate',
    'is_winner',
    'party.id',
    'party.name',
    'party.short_name',
    'party.slug',
    'party.color_code',
    'party.symbol',
    'constituency.id',
    'constituency.name',
    'constituency.slug',
    'constituency.district.id',
    'constituency.district.name',
    'constituency.district.slug',
    'constituency.district.province.id',
    'constituency.district.province.name',
    'constituency.district.province.slug',
  ].join(',');

  // Fetch first page (resets list) whenever filters change
  const fetchFirstPage = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setPage(1);

    try {
      const filter = buildFilter(filters);
      // If no filters, randomize offset for random data
      const offset = Object.values(filter).length === 0 ? Math.abs(Math.floor(Math.random() * 20)) : 0;

      // Fetch first page + total count in parallel
      const [items, countItems] = await Promise.all([
        proxyFetch<DirectusCandidate[]>(
          'candidates',
          {
            fields: FIELDS,
            filter,
            limit: PAGE_SIZE,
            offset,
          },
          abortRef.current.signal,
        ),
        // Fetch with limit=1 just to get total — proxy doesn't expose meta,
        // so we fetch all IDs only (tiny payload) to count
        proxyFetch<{ id: number }[]>(
          'candidates',
          {
            fields: 'id',
            filter,
            limit: -1,
          },
          abortRef.current.signal,
        ),
      ]);

      setCandidates(items);
      setTotalCount(countItems.length);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('उम्मेदवार लोड गर्न सकिएन।');
      console.error('[useCandidatesSearch]', err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.province, filters.district, filters.constituency, filters.gender, filters.party]);

  // Load more pages (appends to list)
  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const offset = page * PAGE_SIZE; // current page * size = next offset

    setIsLoadingMore(true);

    try {
      const filter = buildFilter(filters);
      const items = await proxyFetch<DirectusCandidate[]>('candidates', {
        fields: FIELDS,
        filter,
        limit: PAGE_SIZE,
        offset,
        sort: 'full_name',
      });

      setCandidates((prev) => [...prev, ...items]);
      setPage(nextPage);
    } catch (err) {
      console.error('[useCandidatesSearch loadMore]', err);
    } finally {
      setIsLoadingMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  // Load ALL remaining candidates at once
  const loadAll = useCallback(async () => {
    setIsLoadingMore(true);

    try {
      const filter = buildFilter(filters);
      const items = await proxyFetch<DirectusCandidate[]>('candidates', {
        fields: FIELDS,
        filter,
        limit: -1,
        sort: 'full_name',
      });

      setCandidates(items);
      setPage(Math.ceil(items.length / PAGE_SIZE));
    } catch (err) {
      console.error('[useCandidatesSearch loadAll]', err);
    } finally {
      setIsLoadingMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  const hasMore = candidates.length < totalCount;

  return {
    candidates,
    totalCount,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    loadAll,
  };
}

// ─── Hook: single candidate detail ───────────────────────────────────────────

export function useCandidateDetail(slug: string | null) {
  const [candidate, setCandidate] = useState<DirectusCandidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setCandidate(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const FIELDS = [
      'id',
      'full_name',
      'slug',
      'gender',
      'age',
      'education',
      'profession',
      'previous_position',
      'independent_candidate',
      'is_winner',
      'party.id',
      'party.name',
      'party.short_name',
      'party.slug',
      'party.color_code',
      'constituency.id',
      'constituency.name',
      'constituency.slug',
      'constituency.district.name',
      'constituency.district.province.name',
    ].join(',');

    proxyFetch<DirectusCandidate[]>('candidates', {
      fields: FIELDS,
      filter: JSON.stringify({ slug: { _eq: slug } }),
      limit: 1,
    })
      .then((data) => {
        setCandidate(data[0] ?? null);
      })
      .catch((err) => {
        setError('उम्मेदवार विवरण लोड गर्न सकिएन।');
        console.error('[useCandidateDetail]', err);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { candidate, isLoading, error };
}
