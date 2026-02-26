// hooks/use-famous-candidates.ts

import { useState, useEffect } from "react";

type FamousCandidate = {
  id: number;
  full_name: string;
  slug: string;
  initials: string;
  partyName: string;
  partyColor: string;
  constituencyName: string;
};

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join(".") + "."
  );
}

export function useFamousCandidates() {
  const [candidates, setCandidates] = useState<FamousCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const filter = JSON.stringify({ is_famous: { _eq: true } });

    const url = new URL("/api/proxy/candidates", window.location.origin);
    const countUrl = new URL("/api/proxy/candidates", window.location.origin);
    url.searchParams.set("filter", filter);

    url.searchParams.set("limit", "6");
    url.searchParams.set("sort", "full_name");
    url.searchParams.set(
      "fields",
      "id,full_name,slug,party.name,party.short_name,party.color_code,constituency.name",
    );
    countUrl.searchParams.set("fields", "id");
    countUrl.searchParams.set("filter", filter);
    countUrl.searchParams.set("limit", "-1");
    Promise.all([fetch(url.toString()), fetch(countUrl.toString())])
      .then(async ([res, countRes]) => {
        const [json, countJson] = await Promise.all([
          res.json(),
          countRes.json(),
        ]);

        setCandidates(
          (
            json.data as Array<{
              id: number;
              full_name: string;
              slug: string;
              party: {
                name: string;
                short_name: string;
                color_code: string;
              } | null;
              constituency: { name: string } | null;
            }>
          ).map((c) => ({
            id: c.id,
            full_name: c.full_name,
            slug: c.slug,
            initials: getInitials(c.full_name),
            partyName: c.party?.short_name ?? c.party?.name ?? "स्वतन्त्र",
            partyColor: c.party?.color_code ?? "#666666",
            constituencyName: c.constituency?.name ?? "—",
          })),
        );
        setTotalCount((countJson.data as unknown[]).length);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return { candidates, isLoading, totalFamousCandidatesCount: totalCount };
}
