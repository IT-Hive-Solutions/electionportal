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

  // Calculate seat projections
  const partyProjections = parties.map((party) => {
    const predictedFptp = party.won + party.lead * conversionRate;
    const voteShare = totalVotes > 0 ? party.prVotes / totalVotes : 0;
    const prSeats = voteShare * prTotal;
    const totalSeats = predictedFptp + prSeats;

    return {
      ...party,
      predictedFptp,
      prSeats,
      totalSeats,
      short_name: party.shortName,
      color: party.colorCode,
    };
  });

  // Normalize FPTP to match fptpTotal
  const totalPredictedFptp = partyProjections.reduce((sum, p) => sum + p.predictedFptp, 0);
  const fptpScale = totalPredictedFptp > 0 ? fptpTotal / totalPredictedFptp : 1;

  const normalizedProjections = partyProjections.map((p) => ({
    ...p,
    predictedFptp: p.predictedFptp * fptpScale,
    isRuling: p.isRuling || false,
  }));

  // Sort by total seats
  const sortedProjections = [...normalizedProjections].sort((a, b) => b.totalSeats - a.totalSeats);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-10 backdrop-blur-xl flex items-center justify-center z-50 ">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="top-0 bg-gradient-to-r from-primary to-primary/80 text-card p-6 flex justify-between items-center rounded-t-2xl">
          <h1 className="text-3xl font-bold">प्रत्यक्ष मत प्रक्षेपण</h1>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
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
    </div>
  );
}
