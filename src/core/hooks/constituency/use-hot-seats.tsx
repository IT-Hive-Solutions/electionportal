import { useState, useEffect } from "react";

type HotSeat = {
  id: number;
  name: string;
  slug: string;
  district: string;
  province: string;
};

export function useHotSeats() {
  const [hotSeats, setHotSeats] = useState<HotSeat[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const filter = JSON.stringify({ is_hot_seat: { _eq: true } });
    const fields = "id,name,slug,district.name,district.province.name, party.short_name";

    const url = new URL("/api/proxy/constituencies", window.location.origin);
    url.searchParams.set("fields", fields);
    url.searchParams.set("filter", filter);
    url.searchParams.set("limit", "5");
    url.searchParams.set("sort", "name");

    // Fetch first 5 + total count in parallel
    const countUrl = new URL(
      "/api/proxy/constituencies",
      window.location.origin,
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

        setHotSeats(
          (
            json.data as Array<{
              id: number;
              name: string;
              slug: string;
              district: { name: string; province: { name: string } };
            }>
          ).map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            district: c.district?.name ?? "—",
            province: c.district?.province?.name ?? "—",
          })),
        );
        setTotalCount((countJson.data as unknown[]).length);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return { hotSeats, totalHotSeatCount: totalCount, isLoading };
}
