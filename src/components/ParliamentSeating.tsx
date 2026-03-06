'use client';

import { useState, useMemo } from 'react';

const TOTAL_SEATS = 275;
const MAJORITY = Math.ceil(TOTAL_SEATS / 2) + 1;

const defaultParties = [
  {
    id: 1,
    name: 'नेपाली कांग्रेस',
    short_name: 'NC',
    color: '#1565C0',
    predictedFptp: 57,
    prSeats: 32,
    totalSeats: 89,
    isRuling: true,
  },
  {
    id: 2,
    name: 'नेकपा (एमाले)',
    short_name: 'UML',
    color: '#E53935',
    predictedFptp: 78,
    prSeats: 44,
    totalSeats: 79,
    isRuling: false,
  },
  {
    id: 3,
    name: 'नेकपा (माओवादी)',
    short_name: 'MC',
    color: '#B71C1C',
    predictedFptp: 18,
    prSeats: 14,
    totalSeats: 32,
    isRuling: true,
  },
  {
    id: 4,
    name: 'राष्ट्रिय स्वतन्त्र पार्टी',
    short_name: 'RSP',
    color: '#00897B',
    predictedFptp: 20,
    prSeats: 11,
    totalSeats: 21,
    isRuling: false,
  },
  {
    id: 5,
    name: 'राप्रपा',
    short_name: 'RPP',
    color: '#F57F17',
    predictedFptp: 14,
    prSeats: 7,
    totalSeats: 14,
    isRuling: false,
  },
  {
    id: 6,
    name: 'जनमत पार्टी',
    short_name: 'JP',
    color: '#6A1B9A',
    predictedFptp: 6,
    prSeats: 5,
    totalSeats: 12,
    isRuling: true,
  },
  {
    id: 7,
    name: 'लोसपा',
    short_name: 'LSP',
    color: '#0277BD',
    predictedFptp: 4,
    prSeats: 4,
    totalSeats: 10,
    isRuling: false,
  },
  {
    id: 8,
    name: 'अन्य',
    short_name: 'OTH',
    color: '#78909C',
    predictedFptp: 10,
    prSeats: 8,
    totalSeats: 18,
    isRuling: false,
  },
];

function generateHemicyclePositions(totalSeats: number) {
  const positions = [];
  const numRows = 8;
  const innerRadius = 120;
  const rowSpacing = 28;

  // Distribute seats across rows (more seats in outer rows)
  const rowWeights = [0.06, 0.08, 0.1, 0.12, 0.13, 0.14, 0.16, 0.21];
  const rowCounts = rowWeights.map((w) => Math.round(w * totalSeats));
  // Adjust for rounding
  const diff = totalSeats - rowCounts.reduce((a, b) => a + b, 0);
  rowCounts[rowCounts.length - 1] += diff;

  for (let row = 0; row < numRows; row++) {
    const r = innerRadius + row * rowSpacing;
    const count = rowCounts[row];
    for (let i = 0; i < count; i++) {
      // Spread across 180 degrees (π radians), left to right
      const angle = Math.PI - (i / (count - 1)) * Math.PI;
      const x = r * Math.cos(angle);
      const y = -r * Math.sin(angle); // negative because SVG y goes down
      positions.push({ x, y, row });
    }
  }
  return positions;
}

export default function ParliamentSeating({ parties = defaultParties }) {
  const [hoveredParty, setHoveredParty] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; short: string; color: string; x: number; y: number } | null>(
    null,
  );

  const rulingSeats = parties.filter((p) => p.isRuling).reduce((s, p) => s + Math.round(p.totalSeats), 0);
  const oppositionSeats = TOTAL_SEATS - rulingSeats;
  const hasSupermajority = rulingSeats >= MAJORITY;

  // Build seat list: ruling parties left half, opposition right half
  const rulingParties = parties.filter((p) => p.isRuling);
  const oppositionParties = parties.filter((p) => !p.isRuling);

  const seatList = useMemo(() => {
    const seats = [];
    // Ruling goes on the left side
    for (const party of rulingParties) {
      for (let i = 0; i < Math.round(party.totalSeats); i++) {
        seats.push({ ...party, side: 'ruling' });
      }
    }
    // Opposition on right side
    for (const party of oppositionParties) {
      for (let i = 0; i < Math.round(party.totalSeats); i++) {
        seats.push({ ...party, side: 'opposition' });
      }
    }
    return seats;
  }, [parties]);

  const positions = useMemo(() => generateHemicyclePositions(TOTAL_SEATS), []);

  const svgWidth = 700;
  const svgHeight = 340;
  const cx = svgWidth / 2;
  const cy = svgHeight - 30;
  const seatRadius = 6.5;

  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Mukta', serif",
        background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
        minHeight: '100vh',
        padding: '32px 16px',
        color: '#e2e8f0',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.25em',
              color: '#94a3b8',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            नेपाल संघीय संसद
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#f1f5f9',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            संसद सिट प्रक्षेपण
          </h1>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              marginTop: 16,
              fontSize: 13,
            }}
          >
            <span style={{ color: '#94a3b8' }}>
              कुल सिट: <strong style={{ color: '#f1f5f9' }}>{TOTAL_SEATS}</strong>
            </span>
            <span style={{ color: '#94a3b8' }}>
              बहुमत: <strong style={{ color: '#fbbf24' }}>{MAJORITY}</strong>
            </span>
          </div>
        </div>

        {/* Ruling / Opposition summary bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 12,
              padding: '14px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.15em',
                color: '#6ee7b7',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              सत्तारूढ पार्टी
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#34d399', lineHeight: 1 }}>{rulingSeats}</div>
            <div style={{ fontSize: 12, color: '#6ee7b7', marginTop: 4 }}>
              {hasSupermajority ? '✓ बहुमत छ' : `${MAJORITY - rulingSeats} सिट अपुग`}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12,
              padding: '14px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.15em',
                color: '#fca5a5',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              प्रतिपक्ष
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#f87171', lineHeight: 1 }}>{oppositionSeats}</div>
            <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 4 }}>{oppositionParties.length} दल</div>
          </div>
        </div>

        {/* SVG Hemicycle */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '8px 4px 4px',
            marginBottom: 24,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ width: '100%', display: 'block', overflow: 'visible' }}
          >
            {/* Arc row guides */}
            {[120, 148, 176, 204, 232, 260, 288, 316].map((r, i) => (
              <path
                key={i}
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            ))}

            {/* Center dividing line */}
            <line
              x1={cx}
              y1={cy - 340}
              x2={cx}
              y2={cy}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Labels */}
            <text
              x={cx - 20}
              y={cy - 280}
              fill="rgba(52,211,153,0.7)"
              fontSize="11"
              fontFamily="Georgia"
              textAnchor="end"
            >
              सत्तारूढ पार्टी
            </text>
            <text
              x={cx + 20}
              y={cy - 280}
              fill="rgba(248,113,113,0.7)"
              fontSize="11"
              fontFamily="Georgia"
              textAnchor="start"
            >
              विपक्ष
            </text>

            {/* Majority arc indicator */}
            {(() => {
              const majorityAngle = Math.PI * (1 - rulingSeats / TOTAL_SEATS);
              const r = 105;
              const x1 = cx + r * Math.cos(Math.PI);
              const y1 = cy + r * Math.sin(Math.PI);
              const x2 = cx + r * Math.cos(majorityAngle);
              const y2 = cy - r * Math.sin(majorityAngle);
              return (
                <path
                  d={`M ${x1} ${y1} A ${r} ${r} 0 ${rulingSeats > TOTAL_SEATS / 2 ? 1 : 0} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={hasSupermajority ? 'rgba(52,211,153,0.5)' : 'rgba(251,191,36,0.5)'}
                  strokeWidth="3"
                />
              );
            })()}

            {/* Seats */}
            {positions.map((pos, i) => {
              const seat = seatList[i];
              if (!seat) return null;
              const isHovered = hoveredParty === seat.id;
              return (
                <circle
                  key={i}
                  cx={cx + pos.x}
                  cy={cy + pos.y}
                  r={isHovered ? seatRadius + 2 : seatRadius}
                  fill={seat.color}
                  opacity={hoveredParty === null || isHovered ? 1 : 0.35}
                  stroke={
                    isHovered ? '#fff' : seat.side === 'ruling' ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'
                  }
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => {
                    setHoveredParty(seat.id);
                    setTooltip({
                      name: seat.name,
                      short: seat.short_name,
                      color: seat.color,
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredParty(null);
                    setTooltip(null);
                  }}
                />
              );
            })}

            {/* Speaker podium */}
            <ellipse
              cx={cx}
              cy={cy + 6}
              rx={28}
              ry={10}
              fill="#1e293b"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            <text x={cx} y={cy + 10} fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Georgia" textAnchor="middle">
              अध्यक्ष
            </text>

            {/* Floor line */}
            <line x1={cx - 330} y1={cy + 1} x2={cx + 330} y2={cy + 1} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          </svg>

          {/* Floating tooltip */}
          {tooltip && (
            <div
              style={{
                position: 'fixed',
                top: tooltip.y - 50,
                left: tooltip.x + 12,
                background: '#1e293b',
                border: `1px solid ${tooltip.color}`,
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                color: '#f1f5f9',
                pointerEvents: 'none',
                zIndex: 100,
                whiteSpace: 'nowrap',
                boxShadow: `0 0 16px ${tooltip.color}44`,
              }}
            >
              <span style={{ color: tooltip.color, fontWeight: 700 }}>{tooltip.short}</span>
              {' — '}
              {tooltip.name}
            </div>
          )}
        </div>

        {/* Party cards */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.15em',
              color: '#64748b',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            पार्टी विवरण
          </div>

          {/* Ruling */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                color: '#34d399',
                textTransform: 'uppercase',
                marginBottom: 8,
                borderLeft: '3px solid #34d399',
                paddingLeft: 10,
              }}
            >
              सत्तारूढ पार्टी
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {rulingParties.map((party) => (
                <PartyCard
                  key={party.id}
                  party={party}
                  isHovered={hoveredParty === party.id}
                  onEnter={() => setHoveredParty(party.id)}
                  onLeave={() => setHoveredParty(null)}
                  accent="#34d399"
                />
              ))}
            </div>
          </div>

          {/* Opposition */}
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                color: '#f87171',
                textTransform: 'uppercase',
                marginBottom: 8,
                borderLeft: '3px solid #f87171',
                paddingLeft: 10,
              }}
            >
              प्रतिपक्ष
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {oppositionParties.map((party) => (
                <PartyCard
                  key={party.id}
                  party={party}
                  isHovered={hoveredParty === party.id}
                  onEnter={() => setHoveredParty(party.id)}
                  onLeave={() => setHoveredParty(null)}
                  accent="#f87171"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartyCard({
  party,
  isHovered,
  onEnter,
  onLeave,
  accent,
}: {
  party: (typeof defaultParties)[0];
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  accent: string;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: isHovered ? `${party.color}22` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isHovered ? party.color : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 10,
        padding: '10px 12px',
        cursor: 'default',
        transition: 'all 0.2s',
        boxShadow: isHovered ? `0 0 20px ${party.color}44` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: party.color,
            flexShrink: 0,
            boxShadow: `0 0 6px ${party.color}88`,
          }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>{party.short_name}</div>
          <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.2 }}>{party.name}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, fontSize: 11 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: 9, marginBottom: 2 }}>प्रत्यक्ष</div>
          <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{Math.round(party.predictedFptp)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: 9, marginBottom: 2 }}>समानुपातिक</div>
          <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{Math.round(party.prSeats)}</div>
        </div>
        <div style={{ textAlign: 'center', background: `${party.color}22`, borderRadius: 4, padding: '2px 0' }}>
          <div style={{ color: '#64748b', fontSize: 9, marginBottom: 2 }}>कुल</div>
          <div style={{ color: party.color, fontWeight: 800, fontSize: 13 }}>{Math.round(party.totalSeats)}</div>
        </div>
      </div>
    </div>
  );
}
