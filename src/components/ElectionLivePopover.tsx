'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ParliamentSeating from './ParliamentSeating';
import FloatingPredictionButton from './FloatingPredictionButton';

export type PartyData = {
  id: number;
  name: string;
  shortName: string;
  short_name?: string; // for display in Nepalese
  colorCode: string;
  color?: string;
  lead: number;
  won: number;
  prVotes: number;
  predictedFptp?: number;
  prSeats?: number;
  totalSeats?: number;
  isRuling?: boolean;
};

type Props = {
  parties: PartyData[];
  fptpTotal: number;
  prTotal: number;
  conversionRate: number;
};

const MAJORITY_SEAT = 138;
const TWO_THIRD_MAJORITY = 184;
const TOTAL_SEATS = 275;

export default function ElectionDashboardOverlay({ parties, fptpTotal, prTotal, conversionRate }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  // Total PR votes
  const totalVotes = parties.reduce((sum, party) => sum + party.prVotes, 0);

  // ─── Realistic Projection Logic ───────────────────────────────────────────
  //
  // FPTP Projection:
  //   Won seats are certain (weight = 1.0).
  //   Leading seats are probabilistic. We apply a lead-confidence adjustment:
  //     - Parties that hold a disproportionately large share of all "leading"
  //       seats face higher uncertainty — some of those leads are soft and will
  //       flip. We apply a mild diminishing-returns penalty based on leadShare.
  //     - conversionRate (supplied by parent) reflects how complete the count
  //       is. We clamp it to [0.60, 0.92] to stay in realistic empirical range.
  //   After projection, FPTP totals are scaled to sum exactly to fptpTotal so
  //   seat counts remain self-consistent.
  //
  // PR Seat Allocation — Sainte-Laguë Method (used in Nepal):
  //   1. Eligibility: party must project ≥1 FPTP seat AND hold ≥3% vote share.
  //   2. Seats are awarded iteratively. In each round the seat goes to the party
  //      with the highest quotient  =  prVotes / (2 * seatsWonSoFar + 1).
  //      This is the standard Sainte-Laguë divisor sequence: 1, 3, 5, 7 …
  //   Unlike simple proportional division, Sainte-Laguë prevents large parties
  //   from being over-represented and avoids remainder-rounding bias.
  //
  // ──────────────────────────────────────────────────────────────────────────

  // Clamp conversionRate to a realistic range
  const clampedConversionRate = Math.min(0.92, Math.max(0.6, conversionRate));

  // Lead confidence: parties with a large share of all leads get a mild penalty
  // because not every lead is equally safe — some are marginal and will flip.
  const totalLeads = parties.reduce((sum, p) => sum + p.lead, 0);

  const partyProjections = parties.map((party) => {
    const leadShare = totalLeads > 0 ? party.lead / totalLeads : 0;
    // Parties holding many leads face slightly more uncertainty (soft leads)
    const leadConfidenceFactor = clampedConversionRate * (1 - 0.08 * leadShare);
    const predictedFptp = party.won + party.lead * leadConfidenceFactor;

    return {
      ...party,
      predictedFptp,
      prSeats: 0, // filled in Sainte-Laguë pass below
      totalSeats: 0,
      short_name: party.shortName,
      color: party.colorCode,
    };
  });

  // Scale FPTP projections so they sum exactly to fptpTotal
  const totalPredictedFptp = partyProjections.reduce((sum, p) => sum + p.predictedFptp, 0);
  const fptpScale = totalPredictedFptp > 0 ? fptpTotal / totalPredictedFptp : 1;
  const scaledProjections = partyProjections.map((p) => ({
    ...p,
    predictedFptp: p.predictedFptp * fptpScale,
  }));

  // ── Sainte-Laguë PR allocation ────────────────────────────────────────────
  const prSeatsAlloc: Record<number, number> = {};
  scaledProjections.forEach((p) => (prSeatsAlloc[p.id] = 0));

  // Eligibility: ≥1 projected FPTP seat AND ≥3% national PR vote share
  const qualifyingParties = scaledProjections.filter((p) => {
    const voteShare = totalVotes > 0 ? p.prVotes / totalVotes : 0;
    return p.predictedFptp >= 1 && voteShare >= 0.03;
  });

  // Iteratively award each PR seat to the party with the highest Sainte-Laguë quotient
  for (let seat = 0; seat < prTotal; seat++) {
    let bestParty: (typeof qualifyingParties)[0] | null = null;
    let bestQuotient = -1;

    for (const party of qualifyingParties) {
      const seatsWon = prSeatsAlloc[party.id];
      const quotient = party.prVotes / (2 * seatsWon + 1);
      if (quotient > bestQuotient) {
        bestQuotient = quotient;
        bestParty = party;
      }
    }

    if (bestParty) {
      prSeatsAlloc[bestParty.id] += 1;
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  const normalizedProjections = scaledProjections
    .map((p) => {
      const prSeats = prSeatsAlloc[p.id] ?? 0;
      return {
        ...p,
        prSeats,
        totalSeats: p.predictedFptp + prSeats,
        isRuling: p.isRuling || false,
      };
    })
    .filter((p) => p.totalSeats >= 1);

  // Sort by total seats
  const sortedProjections = [...normalizedProjections].sort((a, b) => b.totalSeats - a.totalSeats);

  if (!isOpen) return null;

  return (
    // <div className="fixed inset-10 backdrop-blur-xl flex items-center justify-center z-50 ">
    <Card className="w-full bg-card shadow-2xl rounded-2xl">
      {/* Header */}
      <div className="top-0 bg-gradient-to-r from-primary to-primary/80 text-card p-6 flex justify-between items-center rounded-t-2xl">
        <h1 className="text-3xl font-bold">प्रत्यक्ष मत प्रक्षेपण</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Parliament Seating */}
        <ParliamentSeating parties={sortedProjections} />

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-2 border-border bg-background">
            <p className="text-sm font-semibold text-muted-foreground mb-1">बहुमत सिट</p>
            <p className="text-3xl font-bold text-primary">{MAJORITY_SEAT}</p>
          </Card>
          <Card className="p-4 border-2 border-border bg-background">
            <p className="text-sm font-semibold text-muted-foreground mb-1">दुई-तिहाई बहुमत</p>
            <p className="text-3xl font-bold text-secondary">{TWO_THIRD_MAJORITY}</p>
          </Card>
          <Card className="p-4 border-2 border-border bg-background">
            <p className="text-sm font-semibold text-muted-foreground mb-1">कुल प्रत्यक्ष सिट</p>
            <p className="text-3xl font-bold text-accent-foreground">{fptpTotal}</p>
          </Card>
          <Card className="p-4 border-2 border-border bg-background">
            <p className="text-sm font-semibold text-muted-foreground mb-1">कुल समानुपातिक सिट</p>
            <p className="text-3xl font-bold text-foreground">{prTotal}</p>
          </Card>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <h2 className="text-xl font-bold text-foreground mb-4">पार्टी प्रदर्शन</h2>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted border-b-2 border-border">
                <TableHead>पार्टी</TableHead>
                <TableHead className="text-right">अगाडि</TableHead>
                <TableHead className="text-right">जित</TableHead>
                <TableHead className="text-right">प्रत्यक्ष अनुमान</TableHead>
                <TableHead className="text-right">समानुपातिक अनुमान</TableHead>
                <TableHead className="text-right">कुल सिट</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProjections.map((party) => (
                <TableRow key={party.id} className="border-b border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }} />
                      {party.name} ({party.short_name})
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{Math.round(party.lead)}</TableCell>
                  <TableCell className="text-right">{Math.round(party.won)}</TableCell>
                  <TableCell className="text-right">{Math.round(party.predictedFptp)}</TableCell>
                  <TableCell className="text-right">{Math.round(party.prSeats)}</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-primary text-card font-bold">{Math.round(party.totalSeats)}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
    // </div>
  );
}
