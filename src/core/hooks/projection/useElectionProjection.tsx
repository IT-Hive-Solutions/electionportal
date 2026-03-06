'use client';

import { useState, useEffect } from 'react';

export type PartyData = {
  id: number;
  name: string;
  shortName: string;
  colorCode: string;
  lead: number;
  won: number;
  prVotes: number;
  isRuling: boolean;
};

export function usePartyResults() {
  const [parties, setParties] = useState<PartyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // FPTP results from Directus
        const fptpRes = await fetch(
          '/api/proxy/fptp_results?fields=party.id,party.name,party.short_name,party.color_code,party.is_ruling, lead,won',
        );
        if (!fptpRes.ok) throw new Error(`HTTP ${fptpRes.status}`);
        const fptpJson = await fptpRes.json();

        // PR votes from Directus
        const prRes = await fetch('/api/proxy/pr_votes?fields=party.id,votes');
        if (!prRes.ok) throw new Error(`HTTP ${prRes.status}`);
        const prJson = await prRes.json();

        // Map FPTP results by party
        const partiesMap = new Map<number, PartyData>();

        fptpJson.data.forEach((fptp: any) => {
          const party = fptp.party;
          if (!party) return;
          partiesMap.set(party.id, {
            id: party.id,
            name: party.name,
            shortName: party.short_name,
            colorCode: party.color_code ?? '#003da5',
            lead: fptp.lead ?? 0,
            won: fptp.won ?? 0,
            prVotes: 0, // fill from PR later
            isRuling: party.is_ruling ?? false,
          });
        });

        // Add PR votes
        prJson.data.forEach((pr: any) => {
          const party = partiesMap.get(pr.party.id);
          if (party) party.prVotes = pr.votes ?? 0;
        });

        setParties(Array.from(partiesMap.values()));
      } catch (err) {
        console.error('[usePartyResults]', err);
        setError('डेटा लोड गर्न सकिएन।');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { parties, isLoading, error };
}
