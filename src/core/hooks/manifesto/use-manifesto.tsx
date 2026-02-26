/**
 * hooks/use-manifestos.ts
 *
 * Fetches from the `manifesto` collection (not parties).
 *
 * Schema:
 *   manifesto { id, party (→parties), main_focus, summary (HTML), main_point, file (→directus_files) }
 *   parties   { id, name, short_name, slug, color_code }
 */

import { useState, useEffect } from "react";

export type Manifesto = {
  id: number;
  // From party relation
  partyName: string;
  partyShortName: string;
  partySlug: string;
  partyColor: string;
  // Manifesto fields
  mainFocus: string | null;
  summary: string[]; // raw HTML from rich text editor
  mainPoint: string | null;
  fileId: string | null; // uuid for directus_files download
};

export function useManifestos() {
  const [manifestos, setManifestos] = useState<Manifesto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("/api/proxy/manifesto", window.location.origin);
    url.searchParams.set(
      "fields",
      [
        "id",
        "main_focus",
        "main_policy_1",
        "main_policy_2",
        "main_policy_3",
        "main_policy_4",
        "main_policy_5",
        "main_point",
        "file",
        "party.id",
        "party.name",
        "party.short_name",
        "party.slug",
        "party.color_code",
      ].join(","),
    );
    url.searchParams.set("limit", "-1");
    url.searchParams.set("sort", "party.priority");

    fetch(url.toString())
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        type Raw = {
          id: number;
          main_focus: string | null;
          main_policy_1: string;
          main_policy_2: string;
          main_policy_3: string;
          main_policy_4: string;
          main_policy_5: string;
          main_point: string | null;
          file: string | null;
          party: {
            id: number;
            name: string;
            short_name: string;
            slug: string;
            color_code: string;
          } | null;
        };

        setManifestos(
          (json.data as Raw[]).map((m) => ({
            id: m.id,
            partyName: m.party?.name ?? "अज्ञात दल",
            partyShortName: m.party?.short_name ?? "—",
            partySlug: m.party?.slug ?? "",
            partyColor: m.party?.color_code ?? "#003da5",
            mainFocus: m.main_focus,
            summary: [
              String(m?.main_policy_1),
              String(m?.main_policy_2),
              String(m?.main_policy_3),
              String(m?.main_policy_4),
              String(m?.main_policy_5),
            ],
            mainPoint: m.main_point,
            fileId: m.file,
          })),
        );
      })
      .catch((err) => {
        console.error("[useManifestos]", err);
        setError("घोषणापत्र लोड गर्न सकिएन।");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { manifestos, isLoading, error };
}
