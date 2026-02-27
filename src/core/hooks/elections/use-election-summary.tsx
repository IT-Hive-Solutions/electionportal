import { useState, useEffect } from 'react';

// ─── Raw type matching Directus schema exactly ────────────────────────────────

export type ElectionSummaryRaw = {
  id: number;
  candidates_count: number | null;
  party_counts: number | null;
  hot_seat_count: number | null;
  constituency_count: number | null;
  vouter_count: number | null; // note: typo in schema kept as-is
  vouter_count_male: number | null; // note: typo in schema kept as-is
  voter_count_female: number | null;
  voter_count_others: number | null;
  expected_ballot_conversion: number | null;
  // Previous election
  prev_election_seat: number | null;
  prev_election_vote_percent: number | null;
  prev_election_registered_voter_count: number | null;
  prev_election_female_win_count: number | null;
  prev_election_party_1_count: number | null;
  prev_election_party_2_count: number | null;
  prev_election_party_3_count: number | null;
  prev_election_party_4_count: number | null;
  prev_election_party_5_count: number | null;
  prev_election_party_other_count: number | null;
  // Turnout by round
  turnout_1: number | null;
  turnout_2: number | null;
  turnout_3: number | null;
  turnout_4: number | null;
  turnout_5: number | null;
  // Voter age groups
  voter_count_age_18_30: number | null;
  voter_count_age_31_45: number | null;
  voter_count_age_46_60: number | null;
  voter_count_age_60_above: number | null;
  // Province voter counts 2079 vs 2082
  voter_count_prov1_2079: number | null;
  voter_count_prov1_2082: number | null;
  voter_count_prov2_2079: number | null;
  voter_count_prov2_2082: number | null;
  voter_count_prov3_2079: number | null;
  voter_count_prov3_2082: number | null;
  voter_count_prov4_2079: number | null;
  voter_count_prov4_2082: number | null;
  voter_count_prov5_2079: number | null;
  voter_count_prov5_2082: number | null;
  voter_count_prov6_2079: number | null;
  voter_count_prov6_2082: number | null;
  voter_count_prov7_2079: number | null;
  voter_count_prov7_2082: number | null;
  // Candidate breakdown
  candidate_count_male: number | null;
  candidate_count_female: number | null;
  candidate_count_other: number | null;
  candidate_count_parties: number | null;
  candidate_count_independent: number | null;
};

// ─── Derived shape for easy consumption in components ─────────────────────────

export type ElectionSummary = {
  // Hero stat cards
  candidatesCount: number;
  partyCount: number;
  hotSeatCount: number;
  constituencyCount: number;
  totalVoters: number;
  votersMale: number;
  votersFemale: number;
  votersOther: number;
  expectedBallotConversion: number;

  // Candidate gender breakdown
  candidatesMale: number;
  candidatesFemale: number;
  candidatesOther: number;
  candidatesParty: number;
  candidatesIndependent: number;

  // Previous election stats
  prevElectionSeats: number;
  prevElectionVotePercent: number;
  prevElectionRegisteredVoters: number;
  prevElectionFemaleWins: number;
  prevElectionParties: {
    party1: number;
    party2: number;
    party3: number;
    party4: number;
    party5: number;
    other: number;
  };

  // Voter turnout rounds (for trend chart)
  turnout: number[];

  // Age group voter distribution (for demographics chart)
  voterAgeGroups: {
    group: string; // Nepali label
    voters: number;
  }[];

  // Province comparison 2079 vs 2082 (for province comparison chart)
  provinceComparison: {
    name: string;
    '२०७९': number;
    '२०८२': number;
  }[];
};

// Province name labels (order matches prov1–prov7 in schema)
const PROVINCE_NAMES = ['कोशी', 'मधेश', 'बागमती', 'गण्डकी', 'लुम्बिनी', 'कर्णाली', 'सुदूरपश्चिम'];

// ─── Transform raw → derived ──────────────────────────────────────────────────

function transform(raw: ElectionSummaryRaw): ElectionSummary {
  const n = (v: number | null) => v ?? 0;

  return {
    candidatesCount: n(raw.candidates_count),
    partyCount: n(raw.party_counts),
    hotSeatCount: n(raw.hot_seat_count),
    constituencyCount: n(raw.constituency_count),
    totalVoters: n(raw.vouter_count),
    votersMale: n(raw.vouter_count_male),
    votersFemale: n(raw.voter_count_female),
    votersOther: n(raw.voter_count_others),
    expectedBallotConversion: n(raw.expected_ballot_conversion),

    candidatesMale: n(raw.candidate_count_male),
    candidatesFemale: n(raw.candidate_count_female),
    candidatesOther: n(raw.candidate_count_other),
    candidatesParty: n(raw.candidate_count_parties),
    candidatesIndependent: n(raw.candidate_count_independent),

    prevElectionSeats: n(raw.prev_election_seat),
    prevElectionVotePercent: n(raw.prev_election_vote_percent),
    prevElectionRegisteredVoters: n(raw.prev_election_registered_voter_count),
    prevElectionFemaleWins: n(raw.prev_election_female_win_count),
    prevElectionParties: {
      party1: n(raw.prev_election_party_1_count),
      party2: n(raw.prev_election_party_2_count),
      party3: n(raw.prev_election_party_3_count),
      party4: n(raw.prev_election_party_4_count),
      party5: n(raw.prev_election_party_5_count),
      other: n(raw.prev_election_party_other_count),
    },

    turnout: [n(raw.turnout_1), n(raw.turnout_2), n(raw.turnout_3), n(raw.turnout_4), n(raw.turnout_5)].filter(
      (t) => t > 0,
    ),

    voterAgeGroups: [
      { group: '१८-३०', voters: n(raw.voter_count_age_18_30) },
      { group: '३१-४५', voters: n(raw.voter_count_age_31_45) },
      { group: '४६-६०', voters: n(raw.voter_count_age_46_60) },
      { group: '६०+', voters: n(raw.voter_count_age_60_above) },
    ],

    provinceComparison: PROVINCE_NAMES.map((name, i) => {
      const prov = i + 1;
      const key2079 = `voter_count_prov${prov}_2079` as keyof ElectionSummaryRaw;
      const key2082 = `voter_count_prov${prov}_2082` as keyof ElectionSummaryRaw;
      return {
        name,
        '२०७९': n(raw[key2079] as number | null),
        '२०८२': n(raw[key2082] as number | null),
      };
    }),
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useElectionSummary() {
  const [data, setData] = useState<ElectionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // election_summary is a singleton — Directus serves it at the collection level
    // Since your proxy route handles readItems, fetch with limit:1
    const url = new URL('/api/proxy/election_summary', window.location.origin);
    url.searchParams.set('limit', '1');

    fetch(url.toString())
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        // Singleton may return object or array with one item
        const raw: ElectionSummaryRaw = Array.isArray(json.data) ? json.data[0] : json.data;
        if (!raw) throw new Error('No data');
        setData(transform(raw));
      })
      .catch((err) => {
        console.error('[useElectionSummary]', err);
        setError('तथ्याङ्क लोड गर्न सकिएन।');
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}
