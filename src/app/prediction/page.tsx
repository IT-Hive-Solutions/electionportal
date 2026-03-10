'use client';

import ElectionDashboardOverlay from '@/components/ElectionLivePopover';
import Header from '@/components/Header';
import { usePartyResults } from '@/core/hooks/projection/useElectionProjection';

export default function PredictionPage() {
  const { parties: partiesForPrediction, totalPrVotes } = usePartyResults();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ElectionDashboardOverlay
        parties={partiesForPrediction || []}
        totalPrVotes={totalPrVotes}
        fptpTotal={165}
        prTotal={110}
        conversionRate={0.88}
      />
    </div>
  );
}
