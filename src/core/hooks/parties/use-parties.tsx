import { useState, useEffect } from "react";

export type Party = {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  colorCode: string;
  logoId: string | null; // uuid → /assets/{id}
  symbolId: string | null; // uuid → /assets/{id}
  establishedYear: string | null;
};

export function useParties() {
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("/api/proxy/parties", window.location.origin);
    url.searchParams.set(
      "fields",
      "id,name,short_name,slug,color_code,logo,symbol,established_year",
    );
    url.searchParams.set("sort", "priority");
    url.searchParams.set("limit", "10");

    fetch(url.toString())
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        type Raw = {
          id: number;
          name: string;
          short_name: string;
          slug: string;
          color_code: string | null;
          logo: string | null;
          symbol: string | null;
          established_year: string | null;
        };
        setParties(
          (json.data as Raw[]).map((p) => ({
            id: p.id,
            name: p.name,
            shortName: p.short_name,
            slug: p.slug,
            colorCode: p.color_code ?? "#003da5",
            logoId: p.logo,
            symbolId: p.symbol,
            establishedYear: p.established_year,
          })),
        );
      })
      .catch((err) => {
        console.error("[useParties]", err);
        setError("दलहरू लोड गर्न सकिएन।");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { parties, isLoading, error };
}
