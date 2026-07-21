export type PartId =
  | 'magazine'
  | 'suppressor'
  | 'optic'
  | 'chargingHandle'
  | 'boltCarrier'
  | 'upper'
  | 'lower'

export type HotspotId =
  | PartId
  | 'handguard'
  | 'barrel'
  | 'stock'
  | 'pistolGrip'
  | 'gasBlock'
  | 'ambiControls'
  | 'e32Bolt'

export interface PartDef {
  id: PartId
  name: string
  shortName: string
  description: string
  facts: string[]
  /** Parts that must be removed before this one can be removed */
  requiresRemoved: PartId[]
  /** Parts that must be installed before this one can be installed */
  requiresInstalled: PartId[]
  /** Home position on the workbench SVG (assembled) */
  home: { x: number; y: number }
  /** Default tray slot when removed */
  tray: { x: number; y: number }
  snapRadius: number
}

export interface HotspotDef {
  id: HotspotId
  name: string
  description: string
  facts: string[]
  /** SVG path for hit area relative to rifle group */
  path: string
  /** Only show when these parts are still installed (all must be true if listed) */
  visibleWhenInstalled?: PartId[]
  /** Only show when these parts are removed */
  visibleWhenRemoved?: PartId[]
}

export const PARTS: Record<PartId, PartDef> = {
  magazine: {
    id: 'magazine',
    name: 'Magazine',
    shortName: 'Mag',
    description:
      'Standard STANAG-pattern magazine seated in the ambidextrous lower. Always remove and clear first.',
    facts: [
      'Remove before any further stripping',
      'Ambidextrous mag release on the L403A1 lower',
      'Visually and physically verify the chamber is clear after removal',
    ],
    requiresRemoved: [],
    requiresInstalled: ['lower'],
    home: { x: 0, y: 0 },
    tray: { x: 80, y: 520 },
    snapRadius: 48,
  },
  suppressor: {
    id: 'suppressor',
    name: 'KAC QDC/MCQ-PRT Suppressor',
    shortName: 'Suppressor',
    description:
      'Quick Detach Coupler / Multi-Calibre Quick / Pressure Reduction Technology suppressor issued with the Alternative Individual Weapon suite.',
    facts: [
      'Adds ~2 in / ~350 g to the rifle',
      'QDC mount indexes onto the muzzle device',
      'Can be removed independently of the field strip',
    ],
    requiresRemoved: [],
    requiresInstalled: ['upper'],
    home: { x: 0, y: 0 },
    tray: { x: 220, y: 520 },
    snapRadius: 56,
  },
  optic: {
    id: 'optic',
    name: 'Vortex 1–10× LPVO',
    shortName: 'LPVO',
    description:
      'Low-power variable optic mounted on the continuous top rail. The AIW suite also includes an Aimpoint ACRO P-2 as a secondary optic.',
    facts: [
      '1–10× magnification for CQB through mid-range',
      'Mounted on the URX-6 continuous rail',
      'Remove before packing or for zero checks',
    ],
    requiresRemoved: [],
    requiresInstalled: ['upper'],
    home: { x: 0, y: 0 },
    tray: { x: 420, y: 520 },
    snapRadius: 52,
  },
  upper: {
    id: 'upper',
    name: 'Upper Receiver Assembly',
    shortName: 'Upper',
    description:
      'URX-6 handguard, 13.7″ cold-hammer-forged dimpled barrel, and Mod 2 gas system. Separates from the lower via front pivot and rear takedown pins.',
    facts: [
      '13.7 in (35 cm) CHF dimpled barrel',
      'Knight’s URX-6 M-LOK handguard',
      'Push rear takedown pin, then pivot / remove',
    ],
    requiresRemoved: [
      'magazine',
      'suppressor',
      'optic',
      'chargingHandle',
      'boltCarrier',
    ],
    requiresInstalled: ['lower'],
    home: { x: 0, y: 0 },
    tray: { x: 620, y: 500 },
    snapRadius: 70,
  },
  chargingHandle: {
    id: 'chargingHandle',
    name: 'Charging Handle',
    shortName: 'CH',
    description:
      'T-shaped charging handle that rides in the upper receiver. Pull rearward to extract the bolt carrier group.',
    facts: [
      'Removed after the upper is opened / separated',
      'Pull rearward with the BCG to extract both',
      'Reinstall before closing the receivers',
    ],
    requiresRemoved: ['magazine'],
    requiresInstalled: ['upper'],
    home: { x: 0, y: 0 },
    tray: { x: 900, y: 520 },
    snapRadius: 40,
  },
  boltCarrier: {
    id: 'boltCarrier',
    name: 'Bolt Carrier Group (E3.2)',
    shortName: 'BCG',
    description:
      'Knight’s E3.2 enhanced bolt carrier group — dual ejectors, enlarged bolt face, and improved cam geometry rated past 50,000 rounds in testing.',
    facts: [
      'Heart of the KS-1 / L403A1 reliability package',
      'Dual ejectors and proprietary extractor',
      'Further strip: firing pin retainer → firing pin → cam pin → bolt',
    ],
    requiresRemoved: ['magazine'],
    requiresInstalled: ['upper', 'chargingHandle'],
    home: { x: 0, y: 0 },
    tray: { x: 1040, y: 520 },
    snapRadius: 44,
  },
  lower: {
    id: 'lower',
    name: 'Lower Receiver Assembly',
    shortName: 'Lower',
    description:
      'Fully ambidextrous KAC lower with Magpul CTR stock and pistol grip. Remains on the bench as the reassembly anchor.',
    facts: [
      'Ambidextrous safety, mag release, and bolt catch',
      'Marked SR-16 / Stoner Rifle family',
      'Holds the buffer and action spring',
    ],
    requiresRemoved: ['magazine', 'upper', 'chargingHandle', 'boltCarrier', 'optic', 'suppressor'],
    requiresInstalled: [],
    home: { x: 0, y: 0 },
    tray: { x: 640, y: 280 },
    snapRadius: 80,
  },
}

/** Recommended remove order for guided mode */
export const REMOVE_ORDER: PartId[] = [
  'magazine',
  'suppressor',
  'optic',
  'chargingHandle',
  'boltCarrier',
  'upper',
]

/** Recommended install order for guided mode */
export const INSTALL_ORDER: PartId[] = [
  'upper',
  'chargingHandle',
  'boltCarrier',
  'optic',
  'suppressor',
  'magazine',
]

export const HOTSPOTS: HotspotDef[] = [
  {
    id: 'handguard',
    name: 'URX-6 Handguard',
    description:
      'Knight’s Armament URX-6 M-LOK free-float handguard providing continuous top rail and accessory mounting.',
    facts: ['Free-float for accuracy', 'M-LOK accessory slots', 'Continuous 12-o’clock rail'],
    path: 'M 210 268 H 430 V 302 H 210 Z',
    visibleWhenInstalled: ['upper'],
  },
  {
    id: 'barrel',
    name: '13.7″ CHF Dimpled Barrel',
    description:
      'Cold-hammer-forged barrel with weight-reducing dimples. Mid-length gas with KAC Mod 2 gas system.',
    facts: ['13.7 in / 35 cm', 'Dimple-cut to reduce weight', 'Self-indexing Mod 2 gas system'],
    path: 'M 95 278 H 210 V 292 H 95 Z',
    visibleWhenInstalled: ['upper'],
  },
  {
    id: 'gasBlock',
    name: 'Mod 2 Gas Block',
    description:
      'Nut-retained gas block feeding a straight gas tube for efficient, consistent cycling.',
    facts: ['Nut-retained (not pinned only)', 'Straight gas tube design', 'Minimises pressure loss'],
    path: 'M 195 268 H 222 V 278 H 195 Z',
    visibleWhenInstalled: ['upper'],
  },
  {
    id: 'stock',
    name: 'Magpul CTR Stock',
    description:
      'Collapsible Magpul CTR carbine stock as issued on the Alternative Individual Weapon configuration.',
    facts: ['Collapsed ~32.2 in OAL', 'Extended ~34.2 in OAL', 'QD sling points'],
    path: 'M 720 255 H 860 V 310 H 720 Z',
    visibleWhenInstalled: ['lower'],
  },
  {
    id: 'pistolGrip',
    name: 'Pistol Grip',
    description: 'Standard AR-pattern pistol grip on the ambidextrous lower receiver.',
    facts: ['Ergonomic firing grip', 'Houses the grip screw into the lower'],
    path: 'M 640 318 H 678 V 378 H 640 Z',
    visibleWhenInstalled: ['lower'],
  },
  {
    id: 'ambiControls',
    name: 'Ambidextrous Controls',
    description:
      'Mirrored safety, magazine release, and bolt catch/release — a defining trait of the KS / L403A1 lower.',
    facts: [
      'Fully ambi lower (rare among service ARs)',
      'Supports left- and right-handed operators',
      'Shared parts commonality with M4-pattern rifles',
    ],
    path: 'M 600 275 H 690 V 318 H 600 Z',
    visibleWhenInstalled: ['lower'],
  },
  {
    id: 'e32Bolt',
    name: 'E3.2 Enhanced Bolt',
    description:
      'Proprietary KAC bolt with dual ejectors, rounded lugs, and enlarged bolt face.',
    facts: ['50,000+ round durability testing', 'Dual ejectors', 'Improved cam pin geometry'],
    path: 'M 520 250 H 620 V 290 H 520 Z',
    visibleWhenRemoved: ['boltCarrier'],
  },
  {
    id: 'magazine',
    name: 'Magazine',
    description: PARTS.magazine.description,
    facts: PARTS.magazine.facts,
    path: 'M 612 318 H 668 V 410 H 612 Z',
    visibleWhenInstalled: ['magazine'],
  },
  {
    id: 'suppressor',
    name: 'KAC QDC/MCQ-PRT Suppressor',
    description: PARTS.suppressor.description,
    facts: PARTS.suppressor.facts,
    path: 'M 8 272 H 95 V 300 H 8 Z',
    visibleWhenInstalled: ['suppressor'],
  },
  {
    id: 'optic',
    name: 'Vortex 1–10× LPVO',
    description: PARTS.optic.description,
    facts: PARTS.optic.facts,
    path: 'M 480 218 H 620 V 258 H 480 Z',
    visibleWhenInstalled: ['optic'],
  },
  {
    id: 'chargingHandle',
    name: 'Charging Handle',
    description: PARTS.chargingHandle.description,
    facts: PARTS.chargingHandle.facts,
    path: 'M 560 248 H 700 V 268 H 560 Z',
    visibleWhenInstalled: ['chargingHandle', 'upper'],
  },
  {
    id: 'boltCarrier',
    name: 'Bolt Carrier Group (E3.2)',
    description: PARTS.boltCarrier.description,
    facts: PARTS.boltCarrier.facts,
    path: 'M 500 268 H 640 V 298 H 500 Z',
    visibleWhenInstalled: ['boltCarrier', 'upper'],
  },
  {
    id: 'upper',
    name: 'Upper Receiver',
    description: PARTS.upper.description,
    facts: PARTS.upper.facts,
    path: 'M 430 258 H 560 V 310 H 430 Z',
    visibleWhenInstalled: ['upper'],
  },
  {
    id: 'lower',
    name: 'Lower Receiver',
    description: PARTS.lower.description,
    facts: PARTS.lower.facts,
    path: 'M 560 288 H 720 V 330 H 560 Z',
    visibleWhenInstalled: ['lower'],
  },
]

export const RIFLE_ORIGIN = { x: 160, y: 40 }
