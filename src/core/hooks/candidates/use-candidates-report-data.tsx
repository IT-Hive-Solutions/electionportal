import { useState, useEffect, useCallback, useRef } from "react";
import type {
  ReportData,
  ReportFilters,
} from "@/core/services/fetch-report-data";
import { endpoints } from "@/core/constants/endpoints";

type UseReportDataReturn = {
  data: ReportData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useReportData(
  filters: ReportFilters = {},
  debounceMs = 300,
): UseReportDataReturn {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (currentFilters: ReportFilters) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (currentFilters.province && currentFilters.province !== "all")
        params.set("province", currentFilters.province);
      if (currentFilters.district && currentFilters.district !== "all")
        params.set("district", currentFilters.district);
      if (currentFilters.constituency && currentFilters.constituency !== "all")
        params.set("constituency", currentFilters.constituency);
      if (currentFilters.party && currentFilters.party !== "all")
        params.set("party", currentFilters.party);
      if (currentFilters.election)
        params.set("election", String(currentFilters.election));

      const res = await fetch(
        `${endpoints.candidates.report}?${params.toString()}`,
        {
          signal: abortRef.current.signal,
        },
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ReportData = await res.json();
      setData(json);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("डेटा लोड गर्न सकिएन। पुनः प्रयास गर्नुहोस्।");
      console.error("[useReportData]", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce on any filter change
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchData(filters), debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.province,
    filters.district,
    filters.constituency,
    filters.party,
    filters.election,
  ]);

  const refetch = useCallback(() => fetchData(filters), [fetchData, filters]);

  return { data, isLoading, error, refetch };
}
