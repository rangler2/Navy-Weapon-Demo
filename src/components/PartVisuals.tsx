import type { PartId } from '../data/parts'

const steel = {
  dark: '#3a4045',
  mid: '#5c656c',
  light: '#8b949c',
  highlight: '#b8c0c6',
  black: '#1e2226',
}

interface PartVisualProps {
  id: PartId
  dimmed?: boolean
}

export function PartVisual({ id, dimmed }: PartVisualProps) {
  const opacity = dimmed ? 0.35 : 1
  switch (id) {
    case 'suppressor':
      return (
        <g opacity={opacity}>
          <rect x="0" y="10" width="88" height="22" rx="4" fill={steel.dark} />
          <rect x="4" y="13" width="80" height="6" rx="2" fill={steel.mid} />
          <rect x="4" y="23" width="80" height="5" rx="2" fill={steel.black} />
          <circle cx="10" cy="21" r="3" fill={steel.light} opacity="0.4" />
          <circle cx="22" cy="21" r="3" fill={steel.light} opacity="0.35" />
          <circle cx="34" cy="21" r="3" fill={steel.light} opacity="0.3" />
          <text x="44" y="8" textAnchor="middle" className="part-label">
            QDC/MCQ-PRT
          </text>
        </g>
      )
    case 'optic':
      return (
        <g opacity={opacity}>
          <rect x="0" y="8" width="130" height="28" rx="3" fill={steel.black} />
          <rect x="8" y="12" width="50" height="20" rx="2" fill={steel.mid} />
          <rect x="66" y="14" width="52" height="16" rx="2" fill={steel.dark} />
          <circle cx="20" cy="22" r="7" fill="#1a2a22" stroke={steel.light} strokeWidth="1.5" />
          <circle cx="105" cy="22" r="6" fill="#1a2a22" stroke={steel.light} strokeWidth="1.5" />
          <rect x="40" y="4" width="18" height="6" rx="1" fill={steel.light} />
          <text x="65" y="2" textAnchor="middle" className="part-label">
            1–10× LPVO
          </text>
        </g>
      )
    case 'magazine':
      return (
        <g opacity={opacity}>
          <path
            d="M 4 0 H 48 L 52 88 H 0 Z"
            fill={steel.dark}
            stroke={steel.black}
            strokeWidth="1"
          />
          <path d="M 10 8 H 42 V 20 H 10 Z" fill={steel.mid} />
          <path d="M 12 28 H 40 V 34 H 12 Z" fill={steel.black} opacity="0.5" />
          <path d="M 12 40 H 40 V 46 H 12 Z" fill={steel.black} opacity="0.5" />
          <path d="M 12 52 H 40 V 58 H 12 Z" fill={steel.black} opacity="0.5" />
          <text x="26" y="-6" textAnchor="middle" className="part-label">
            MAG
          </text>
        </g>
      )
    case 'chargingHandle':
      return (
        <g opacity={opacity}>
          <rect x="20" y="8" width="110" height="8" rx="2" fill={steel.mid} />
          <rect x="0" y="0" width="28" height="24" rx="3" fill={steel.dark} />
          <rect x="118" y="0" width="28" height="24" rx="3" fill={steel.dark} />
          <text x="73" y="-4" textAnchor="middle" className="part-label">
            CHARGING HANDLE
          </text>
        </g>
      )
    case 'boltCarrier':
      return (
        <g opacity={opacity}>
          <rect x="0" y="6" width="140" height="28" rx="3" fill={steel.mid} />
          <rect x="8" y="10" width="50" height="20" rx="2" fill={steel.dark} />
          <circle cx="120" cy="20" r="10" fill={steel.black} />
          <rect x="95" y="14" width="18" height="12" rx="1" fill={steel.light} />
          <path d="M 55 12 H 90 V 28 H 55 Z" fill={steel.highlight} opacity="0.35" />
          <text x="70" y="0" textAnchor="middle" className="part-label">
            E3.2 BCG
          </text>
        </g>
      )
    case 'upper':
      return (
        <g opacity={opacity}>
          {/* Barrel */}
          <rect x="90" y="36" width="130" height="12" rx="2" fill={steel.dark} />
          <rect x="90" y="38" width="130" height="4" fill={steel.mid} opacity="0.5" />
          {/* Gas block */}
          <rect x="195" y="28" width="24" height="10" rx="1" fill={steel.black} />
          {/* Handguard */}
          <rect x="218" y="30" width="210" height="28" rx="3" fill={steel.mid} />
          <rect x="224" y="36" width="198" height="4" fill={steel.light} opacity="0.35" />
          <rect x="224" y="48" width="198" height="3" fill={steel.black} opacity="0.35" />
          {/* Upper receiver */}
          <path
            d="M 428 28 H 560 L 568 58 H 420 Z"
            fill={steel.dark}
            stroke={steel.black}
            strokeWidth="1"
          />
          <rect x="440" y="34" width="100" height="8" rx="1" fill={steel.mid} />
          <text x="320" y="18" textAnchor="middle" className="part-label">
            UPPER / URX-6 / 13.7″
          </text>
        </g>
      )
    case 'lower':
      return (
        <g opacity={opacity}>
          <path
            d="M 430 58 H 720 L 728 88 H 640 L 635 118 H 600 L 595 88 H 422 Z"
            fill={steel.dark}
            stroke={steel.black}
            strokeWidth="1"
          />
          {/* Magwell */}
          <path d="M 600 88 H 655 L 660 130 H 595 Z" fill={steel.mid} />
          {/* Trigger guard */}
          <path
            d="M 575 88 H 600 V 108 H 575 Z"
            fill="none"
            stroke={steel.light}
            strokeWidth="2"
          />
          {/* Pistol grip */}
          <path d="M 630 118 L 668 118 L 675 178 L 640 178 Z" fill={steel.black} />
          {/* Buffer tube */}
          <rect x="720" y="52" width="50" height="22" rx="3" fill={steel.mid} />
          {/* Stock */}
          <path
            d="M 770 42 H 860 L 868 70 L 860 100 H 770 L 762 70 Z"
            fill={steel.dark}
            stroke={steel.black}
            strokeWidth="1"
          />
          <rect x="790" y="58" width="40" height="8" rx="1" fill={steel.mid} />
          <text x="640" y="40" textAnchor="middle" className="part-label">
            LOWER / AMBI / CTR
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
      return { x: 2, y: 262 }
    case 'optic':
      return { x: 485, y: 220 }
    case 'magazine':
      return { x: 608, y: 318 }
    case 'chargingHandle':
      return { x: 545, y: 246 }
    case 'boltCarrier':
      return { x: 500, y: 268 }
    case 'upper':
      return { x: 0, y: 230 }
    case 'lower':
      return { x: 0, y: 230 }
  }
}
