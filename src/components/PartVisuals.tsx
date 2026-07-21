import type { PartId } from '../data/parts'

const c = {
  dark: '#343a3f',
  mid: '#565e65',
  light: '#8a9299',
  hi: '#c2c8cd',
  black: '#171b1f',
  rail: '#6d757c',
  poly: '#2a2e32',
  poly2: '#3a4046',
  bronze: '#6a5a48',
  opticGlass: '#0f1a16',
}

interface PartVisualProps {
  id: PartId
  dimmed?: boolean
  highlight?: boolean
}

function railTeeth(x: number, y: number, n: number, step = 7) {
  return Array.from({ length: n }, (_, i) => (
    <rect
      key={i}
      x={x + i * step}
      y={y}
      width="3.2"
      height="5"
      fill={c.black}
      opacity="0.4"
    />
  ))
}

export function PartVisual({ id, dimmed, highlight }: PartVisualProps) {
  const opacity = dimmed ? 0.3 : 1
  const accent = highlight ? c.hi : 'none'
  const sw = highlight ? 1.75 : 0

  switch (id) {
    case 'suppressor':
      return (
        <g opacity={opacity}>
          {/* QDC coupler */}
          <path
            d="M 78 6 H 98 V 38 H 78 Z"
            fill={c.black}
            stroke={accent}
            strokeWidth={sw}
          />
          <path d="M 82 10 H 94 V 14 H 82 Z" fill={c.light} opacity="0.35" />
          <path d="M 82 30 H 94 V 34 H 82 Z" fill={c.light} opacity="0.25" />
          {/* Can body with slight taper */}
          <path
            d="M 2 10 C 0 10 0 12 0 14 V 30 C 0 32 0 34 2 34 H 80 V 10 Z"
            fill={c.dark}
            stroke={accent}
            strokeWidth={sw}
          />
          <path d="M 6 14 H 76 V 18 H 6 Z" fill={c.mid} opacity="0.7" />
          <path d="M 6 26 H 76 V 30 H 6 Z" fill={c.black} opacity="0.45" />
          {/* Baffle rings */}
          {[14, 28, 42, 56, 70].map((x) => (
            <line
              key={x}
              x1={x}
              y1="12"
              x2={x}
              y2="32"
              stroke={c.light}
              strokeWidth="1"
              opacity="0.22"
            />
          ))}
          <ellipse cx="2" cy="22" rx="3" ry="10" fill={c.black} />
          <text x="48" y="0" textAnchor="middle" className="part-label">
            QDC / MCQ-PRT
          </text>
        </g>
      )

    case 'optic':
      return (
        <g opacity={opacity}>
          {/* Mount base */}
          <rect x="8" y="28" width="100" height="8" rx="1" fill={c.poly} />
          {railTeeth(14, 29, 12, 7.5)}
          {/* LPVO main tube */}
          <path
            d="M 12 8 H 96 C 104 8 108 12 108 18 V 22 C 108 28 104 32 96 32 H 12 C 4 32 0 28 0 22 V 18 C 0 12 4 8 12 8 Z"
            fill={c.mid}
            stroke={accent}
            strokeWidth={sw}
          />
          <path d="M 16 12 H 90 V 16 H 16 Z" fill={c.hi} opacity="0.18" />
          {/* Objective bell */}
          <ellipse cx="14" cy="20" rx="10" ry="12" fill={c.dark} stroke={c.light} strokeWidth="1.2" />
          <ellipse cx="14" cy="20" rx="6" ry="7" fill={c.opticGlass} />
          {/* Ocular */}
          <ellipse cx="98" cy="20" rx="9" ry="11" fill={c.dark} stroke={c.light} strokeWidth="1.2" />
          <ellipse cx="98" cy="20" rx="5" ry="6" fill={c.opticGlass} />
          {/* Turrets */}
          <rect x="44" y="2" width="18" height="10" rx="2" fill={c.rail} />
          <rect x="66" y="4" width="12" height="8" rx="2" fill={c.dark} />
          {/* Offset ACRO silhouette */}
          <rect x="112" y="10" width="36" height="26" rx="3" fill={c.poly} stroke={accent} strokeWidth={sw} />
          <rect x="120" y="16" width="20" height="14" rx="2" fill={c.dark} />
          <circle cx="130" cy="23" r="4.5" fill="#1a0e0e" stroke={c.hi} strokeWidth="1" />
          <text x="74" y="-2" textAnchor="middle" className="part-label">
            1–10× LPVO + ACRO
          </text>
        </g>
      )

    case 'magazine':
      return (
        <g opacity={opacity}>
          <path
            d="M 8 0 H 48 C 52 0 54 4 54 8 L 50 100 H 4 L 0 8 C 0 4 2 0 8 0 Z"
            fill={c.poly}
            stroke={accent !== 'none' ? accent : c.black}
            strokeWidth={sw || 1}
          />
          <path d="M 12 6 H 44 V 16 H 12 Z" fill={c.mid} />
          {/* Magpul-style window */}
          <rect x="16" y="28" width="24" height="48" rx="2" fill="#12181a" opacity="0.7" />
          {[36, 50, 64].map((y) => (
            <path key={y} d={`M 18 ${y} H 38`} stroke={c.light} strokeWidth="1" opacity="0.25" />
          ))}
          <path d="M 10 88 H 46 V 96 H 10 Z" fill={c.black} opacity="0.35" />
          <text x="27" y="-6" textAnchor="middle" className="part-label">
            MAG
          </text>
        </g>
      )

    case 'chargingHandle':
      return (
        <g opacity={opacity}>
          <rect x="28" y="12" width="120" height="7" rx="2" fill={c.mid} />
          {/* Latches */}
          <path
            d="M 0 4 H 34 L 38 12 V 24 H 0 C 0 24 0 4 0 4 Z"
            fill={c.dark}
            stroke={accent}
            strokeWidth={sw}
          />
          <path
            d="M 142 4 H 176 V 24 H 138 V 12 Z"
            fill={c.dark}
            stroke={accent}
            strokeWidth={sw}
          />
          <rect x="6" y="10" width="22" height="4" rx="1" fill={c.hi} opacity="0.35" />
          <rect x="148" y="10" width="22" height="4" rx="1" fill={c.hi} opacity="0.35" />
          <text x="88" y="0" textAnchor="middle" className="part-label">
            CHARGING HANDLE
          </text>
        </g>
      )

    case 'boltCarrier':
      return (
        <g opacity={opacity}>
          <path
            d="M 4 8 H 140 L 152 12 V 32 L 140 36 H 4 C 0 36 0 8 4 8 Z"
            fill={c.mid}
            stroke={accent}
            strokeWidth={sw}
          />
          <rect x="10" y="12" width="52" height="20" rx="2" fill={c.dark} />
          {/* Gas key */}
          <path d="M 22 0 H 48 L 50 10 H 20 Z" fill={c.rail} />
          {/* E3.2 bolt head / lugs */}
          <path d="M 68 14 H 108 V 30 H 68 Z" fill={c.hi} opacity="0.35" />
          {[76, 88, 100].map((x) => (
            <circle key={x} cx={x} cy="22" r="3.2" fill={c.black} opacity="0.55" />
          ))}
          <rect x="112" y="14" width="18" height="14" rx="1" fill={c.light} />
          <circle cx="142" cy="22" r="8" fill={c.black} />
          <circle cx="142" cy="22" r="3" fill={c.bronze} opacity="0.7" />
          <text x="76" y="-2" textAnchor="middle" className="part-label">
            E3.2 BCG
          </text>
        </g>
      )

    case 'upper':
      return (
        <g opacity={opacity}>
          {/* Flash hider / muzzle device stub */}
          <path d="M 86 40 H 102 V 52 H 86 Z" fill={c.black} />
          <path d="M 88 42 H 100 V 44 H 88 Z" fill={c.light} opacity="0.3" />

          {/* CHF dimpled barrel */}
          <path
            d="M 100 40 H 226 V 52 H 100 Z"
            fill={c.dark}
            stroke={accent}
            strokeWidth={sw}
          />
          <path d="M 100 42 H 226 V 45 H 100 Z" fill={c.mid} opacity="0.4" />
          {Array.from({ length: 13 }, (_, i) => (
            <circle
              key={i}
              cx={108 + i * 9}
              cy="46"
              r="2.4"
              fill={c.black}
              opacity="0.5"
            />
          ))}

          {/* Mod 2 gas block */}
          <path d="M 204 28 H 232 V 42 H 204 Z" fill={c.black} />
          <path d="M 210 30 H 226 V 34 H 210 Z" fill={c.light} opacity="0.28" />
          <path d="M 214 24 H 222 V 28 H 214 Z" fill={c.rail} />

          {/* URX-6 handguard — tapered free-float */}
          <path
            d="M 232 28 H 458 L 462 34 V 58 L 458 64 H 232 L 228 58 V 34 Z"
            fill={c.mid}
            stroke={accent}
            strokeWidth={sw}
          />
          {/* Continuous top rail */}
          <rect x="234" y="26" width="222" height="7" fill={c.rail} />
          {railTeeth(238, 27, 28, 7.5)}
          {/* M-LOK side slots */}
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <rect
                x={248 + i * 22}
                y="42"
                width="12"
                height="4"
                rx="1"
                fill={c.black}
                opacity="0.55"
              />
              <rect
                x={248 + i * 22}
                y="52"
                width="12"
                height="4"
                rx="1"
                fill={c.black}
                opacity="0.45"
              />
            </g>
          ))}
          <path d="M 240 38 H 450" stroke={c.hi} strokeWidth="1" opacity="0.2" />

          {/* Upper receiver */}
          <path
            d="M 458 24 H 598 C 606 24 610 30 610 36 V 60 C 610 66 606 70 598 70 H 452 L 448 60 V 34 Z"
            fill={c.dark}
            stroke={accent !== 'none' ? accent : c.black}
            strokeWidth={sw || 1}
          />
          {/* Top rail on receiver */}
          <rect x="460" y="24" width="140" height="7" fill={c.rail} />
          {railTeeth(464, 25, 16, 8)}
          {/* Ejection port */}
          <rect x="472" y="38" width="78" height="18" rx="2" fill={c.black} opacity="0.65" />
          <rect x="478" y="42" width="52" height="10" rx="1" fill={c.poly2} opacity="0.55" />
          {/* Forward assist */}
          <circle cx="572" cy="48" r="7" fill={c.poly} />
          <circle cx="572" cy="48" r="3" fill={c.light} opacity="0.35" />
          {/* Brass deflector */}
          <path d="M 556 36 H 568 V 56 H 556 Z" fill={c.mid} />

          <text x="350" y="14" textAnchor="middle" className="part-label">
            UPPER · URX-6 · 13.7″ CHF
          </text>
        </g>
      )

    case 'lower':
      return (
        <g opacity={opacity}>
          {/* Lower receiver */}
          <path
            d="M 450 54 H 728 L 736 62 V 88 L 728 96 H 652 L 646 128 H 600 L 594 96 H 446 L 442 88 V 62 Z"
            fill={c.dark}
            stroke={accent !== 'none' ? accent : c.black}
            strokeWidth={sw || 1}
          />
          {/* Magwell */}
          <path d="M 598 92 H 656 L 662 138 H 592 Z" fill={c.mid} />
          <path d="M 606 100 H 648 V 130 H 606 Z" fill={c.black} opacity="0.4" />

          {/* Ambi control deck */}
          <rect x="558" y="62" width="40" height="12" rx="3" fill={c.poly} />
          <circle cx="578" cy="68" r="3.5" fill={c.hi} opacity="0.45" />
          <rect x="622" y="64" width="24" height="9" rx="2" fill={c.poly2} />
          <rect x="652" y="64" width="20" height="9" rx="2" fill={c.poly2} />

          {/* Trigger guard */}
          <path
            d="M 566 96 H 598 V 116 Q 582 120 566 116 Z"
            fill="none"
            stroke={c.light}
            strokeWidth="2"
          />

          {/* Pistol grip */}
          <path
            d="M 626 126 C 626 126 672 126 672 126 L 682 192 C 682 198 676 202 670 202 H 640 C 634 202 628 198 628 192 Z"
            fill={c.poly}
            stroke={c.black}
            strokeWidth="1"
          />
          <path d="M 642 140 H 664 V 184 H 642 Z" fill={c.black} opacity="0.22" />

          {/* Buffer tube */}
          <rect x="728" y="50" width="58" height="26" rx="5" fill={c.mid} />
          <rect x="734" y="58" width="46" height="4" fill={c.hi} opacity="0.22" />

          {/* Magpul CTR stock */}
          <path
            d="M 784 38 H 868 C 878 38 886 48 886 58 V 86 C 886 96 878 106 868 106 H 784 C 774 106 766 96 766 86 V 58 C 766 48 774 38 784 38 Z"
            fill={c.poly}
            stroke={c.black}
            strokeWidth="1"
          />
          <path d="M 792 48 H 860 V 56 H 792 Z" fill={c.mid} opacity="0.7" />
          {/* Lock lever */}
          <rect x="812" y="78" width="32" height="8" rx="2" fill={c.dark} />
          {/* QD cups */}
          <circle cx="796" cy="72" r="4.5" fill={c.black} opacity="0.55" />
          <circle cx="860" cy="72" r="4.5" fill={c.black} opacity="0.55" />
          {/* Butt pad */}
          <path d="M 868 42 H 878 V 102 H 868 Z" fill={c.black} opacity="0.5" />

          <text x="650" y="36" textAnchor="middle" className="part-label">
            LOWER · AMBI · CTR
          </text>
        </g>
      )

    default:
      return null
  }
}

/** Assembled rifle as layered groups with local offsets matching hotspot space */
export function AssembledOffsets(part: PartId): { x: number; y: number } {
  switch (part) {
    case 'suppressor':
      return { x: -2, y: 248 }
    case 'optic':
      return { x: 390, y: 188 }
    case 'magazine':
      return { x: 598, y: 308 }
    case 'chargingHandle':
      return { x: 500, y: 222 }
    case 'boltCarrier':
      return { x: 462, y: 252 }
    case 'upper':
      return { x: 0, y: 218 }
    case 'lower':
      return { x: 0, y: 218 }
  }
}

/** Generous invisible hit pads so thin parts stay easy to grab */
export function PartHitArea({ id }: { id: PartId }) {
  // pointerEvents=all: SVG default (visiblePainted) ignores fully transparent fills
  const props = {
    fill: 'rgba(0,0,0,0)',
    pointerEvents: 'all' as const,
  }
  switch (id) {
    case 'suppressor':
      return <rect x="-4" y="0" width="108" height="44" {...props} />
    case 'optic':
      return <rect x="-4" y="-4" width="160" height="48" {...props} />
    case 'magazine':
      return <rect x="-4" y="-8" width="64" height="116" {...props} />
    case 'chargingHandle':
      return <rect x="-4" y="-6" width="186" height="40" {...props} />
    case 'boltCarrier':
      return <rect x="-4" y="-6" width="164" height="48" {...props} />
    case 'upper':
      return <rect x="84" y="18" width="530" height="58" {...props} />
    case 'lower':
      return <rect x="440" y="36" width="450" height="170" {...props} />
    default:
      return null
  }
}
