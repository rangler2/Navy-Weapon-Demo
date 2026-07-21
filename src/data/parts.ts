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
      'STANAG-pattern magazine seated in the ambidextrous lower. Always remove and clear the chamber before any further stripping.',
    facts: [
      'First step in any AR-pattern field strip',
      'Ambidextrous magazine release on the KS / L403A1 lower',
      'Visually and physically verify the chamber is clear after removal',
    ],
    requiresRemoved: [],
    requiresInstalled: ['lower'],
    home: { x: 0, y: 0 },
    tray: { x: 48, y: 500 },
    snapRadius: 56,
  },
  suppressor: {
    id: 'suppressor',
    name: 'KAC QDC/MCQ-PRT Suppressor',
    shortName: 'Suppressor',
    description:
      'Quick Detach Coupler / Mini Close Quarters Pressure Reduction Technology suppressor issued with the Alternative Individual Weapon suite.',
    facts: [
      'Adds roughly 2 in / ~350 g on the muzzle',
      'QDC mount indexes onto the flash hider',
      'Accessory — can come off before opening the receivers',
    ],
    requiresRemoved: ['magazine'],
    requiresInstalled: ['upper'],
    home: { x: 0, y: 0 },
    tray: { x: 140, y: 520 },
    snapRadius: 64,
  },
  optic: {
    id: 'optic',
    name: 'Vortex 1–10× LPVO',
    shortName: 'LPVO',
    description:
      'Low-power variable optic on the continuous top rail. The AIW optics suite also includes an Aimpoint ACRO P-2 as a secondary / offset optic.',
    facts: [
      '1–10× for CQB through mid-range',
      'Sits on the URX-6 continuous Picatinny rail',
      'Remove for packing, transport, or zero checks',
    ],
    requiresRemoved: ['magazine'],
    requiresInstalled: ['upper'],
    home: { x: 0, y: 0 },
    tray: { x: 300, y: 508 },
    snapRadius: 58,
  },
  chargingHandle: {
    id: 'chargingHandle',
    name: 'Charging Handle',
    shortName: 'CH',
    description:
      'T-shaped charging handle that rides in the upper. Pull rearward with the bolt carrier to extract both from the receiver.',
    facts: [
      'Cleared after the magazine is out and the action is safe',
      'Pulls rearward with the BCG for removal',
      'Reinstall before closing the upper on the lower',
    ],
    requiresRemoved: ['magazine'],
    requiresInstalled: ['upper'],
    home: { x: 0, y: 0 },
    tray: { x: 520, y: 522 },
    snapRadius: 48,
  },
  boltCarrier: {
    id: 'boltCarrier',
    name: 'Bolt Carrier Group (E3.2)',
    shortName: 'BCG',
    description:
      'Knight’s E3.2 enhanced bolt carrier group — dual ejectors, enlarged bolt face, and improved cam geometry publicly cited past 50,000 rounds in testing.',
    facts: [
      'Core of the KS-1 / L403A1 reliability package',
      'Dual ejectors and proprietary extractor',
      'Further strip (public AR pattern): retainer → firing pin → cam pin → bolt',
    ],
    requiresRemoved: ['magazine', 'chargingHandle'],
    requiresInstalled: ['upper', 'chargingHandle'],
    home: { x: 0, y: 0 },
    tray: { x: 760, y: 518 },
    snapRadius: 52,
  },
  upper: {
    id: 'upper',
    name: 'Upper Receiver Assembly',
    shortName: 'Upper',
    description:
      'URX-6 handguard, 13.7″ cold-hammer-forged dimpled barrel, and Mod 2 gas system. Separates from the lower via the rear takedown and front pivot pins.',
    facts: [
      '13.7 in (35 cm) CHF dimpled barrel',
      'Knight’s URX-6 M-LOK free-float handguard',
      'Push rear takedown pin, pivot open, then separate',
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
    // Wide part — second tray row so the full URX-6 silhouette stays on-canvas
    tray: { x: 60, y: 590 },
    snapRadius: 86,
  },
  lower: {
    id: 'lower',
    name: 'Lower Receiver Assembly',
    shortName: 'Lower',
    description:
      'Fully ambidextrous KAC lower with Magpul CTR stock and pistol grip. Stays on the bench as the reassembly anchor.',
    facts: [
      'Ambidextrous safety, magazine release, and bolt catch',
      'Marked in the Stoner Rifle / SR-16 family',
      'Houses the buffer and action spring',
    ],
    requiresRemoved: [
      'magazine',
      'upper',
      'chargingHandle',
      'boltCarrier',
      'optic',
      'suppressor',
    ],
    requiresInstalled: [],
    home: { x: 0, y: 0 },
    tray: { x: 640, y: 280 },
    snapRadius: 80,
  },
}

/** Recommended remove order for guided mode (public AR accessory + field-strip flow) */
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
      'Knight’s Armament URX-6 free-float M-LOK handguard. Continuous top rail and modular slots for lights, lasers, and grips.',
    facts: [
      'Free-float — handguard does not touch the barrel',
      'M-LOK accessory slots along the sides',
      'Full-length 12-o’clock Picatinny rail',
    ],
    path: 'M 232 244 H 458 V 284 H 232 Z',
    visibleWhenInstalled: ['upper'],
  },
  {
    id: 'barrel',
    name: '13.7″ CHF Dimpled Barrel',
    description:
      'Cold-hammer-forged, chrome-lined barrel with ball-mill dimples for weight relief. Mid-length gas with KAC Mod 2 gas system.',
    facts: [
      '13.7 in / 35 cm — KS-1 configuration',
      'Dimple-cut to cut weight without soft-point shift',
      'Pairs with the QDC muzzle device for the suppressor',
    ],
    path: 'M 100 254 H 204 V 274 H 100 Z',
    visibleWhenInstalled: ['upper'],
  },
  {
    id: 'gasBlock',
    name: 'Mod 2 Gas Block',
    description:
      'Nut-retained Mod 2 gas block feeding a straight gas tube for consistent cycling, including suppressed fire.',
    facts: [
      'Nut-retained for serviceability',
      'Straight gas-tube layout',
      'Tuned as part of the KS mid-length system',
    ],
    path: 'M 202 244 H 234 V 262 H 202 Z',
    visibleWhenInstalled: ['upper'],
  },
  {
    id: 'stock',
    name: 'Magpul CTR Stock',
    description:
      'Collapsible Magpul CTR carbine stock as commonly issued on the Alternative Individual Weapon configuration.',
    facts: [
      'Collapsed overall length about 32.2 in',
      'Extended overall length about 34.2 in',
      'QD sling cups on the stock body',
    ],
    path: 'M 766 254 H 886 V 328 H 766 Z',
    visibleWhenInstalled: ['lower'],
  },
  {
    id: 'pistolGrip',
    name: 'Pistol Grip',
    description: 'AR-pattern pistol grip on the ambidextrous lower — the primary firing hand interface.',
    facts: [
      'Secures into the lower with the grip screw',
      'Houses / supports the trigger-group area below',
    ],
    path: 'M 628 348 H 678 V 400 H 628 Z',
    visibleWhenInstalled: ['lower'],
  },
  {
    id: 'ambiControls',
    name: 'Ambidextrous Controls',
    description:
      'Mirrored safety, magazine release, and bolt catch/release — a defining trait of the KS / L403A1 lower versus many service ARs.',
    facts: [
      'Fully ambi lower for left- and right-handed use',
      'Shared AR-pattern controls where possible',
      'No need to reconfigure the rifle for weak-hand work',
    ],
    path: 'M 556 276 H 640 V 318 H 556 Z',
    visibleWhenInstalled: ['lower'],
  },
  {
    id: 'e32Bolt',
    name: 'E3.2 Enhanced Bolt',
    description:
      'With the BCG out, the E3.2 bolt face is exposed for inspection — dual ejectors, rounded lugs, and an enlarged bolt face.',
    facts: [
      'Publicly cited 50,000+ round durability testing',
      'Dual ejectors for extraction reliability',
      'Improved cam-pin geometry versus legacy bolts',
    ],
    path: 'M 468 250 H 556 V 288 H 468 Z',
    visibleWhenInstalled: ['upper'],
    visibleWhenRemoved: ['boltCarrier'],
  },
  {
    id: 'magazine',
    name: 'Magazine',
    description: PARTS.magazine.description,
    facts: PARTS.magazine.facts,
    path: 'M 596 306 H 662 V 408 H 596 Z',
    visibleWhenInstalled: ['magazine'],
  },
  {
    id: 'suppressor',
    name: 'KAC QDC/MCQ-PRT Suppressor',
    description: PARTS.suppressor.description,
    facts: PARTS.suppressor.facts,
    path: 'M -2 246 H 98 V 282 H -2 Z',
    visibleWhenInstalled: ['suppressor'],
  },
  {
    id: 'optic',
    name: 'Vortex 1–10× LPVO',
    description: PARTS.optic.description,
    facts: PARTS.optic.facts,
    path: 'M 390 186 H 548 V 228 H 390 Z',
    visibleWhenInstalled: ['optic'],
  },
  {
    id: 'chargingHandle',
    name: 'Charging Handle',
    description: PARTS.chargingHandle.description,
    facts: PARTS.chargingHandle.facts,
    path: 'M 500 220 H 676 V 250 H 500 Z',
    visibleWhenInstalled: ['chargingHandle', 'upper'],
  },
  {
    id: 'boltCarrier',
    name: 'Bolt Carrier Group (E3.2)',
    description: PARTS.boltCarrier.description,
    facts: PARTS.boltCarrier.facts,
    path: 'M 462 250 H 614 V 288 H 462 Z',
    visibleWhenInstalled: ['boltCarrier', 'upper'],
  },
  {
    id: 'upper',
    name: 'Upper Receiver',
    description: PARTS.upper.description,
    facts: PARTS.upper.facts,
    path: 'M 458 242 H 610 V 288 H 458 Z',
    visibleWhenInstalled: ['upper'],
  },
  {
    id: 'lower',
    name: 'Lower Receiver',
    description: PARTS.lower.description,
    facts: PARTS.lower.facts,
    path: 'M 450 272 H 728 V 318 H 450 Z',
    visibleWhenInstalled: ['lower'],
  },
]

export const RIFLE_ORIGIN = { x: 140, y: 36 }

/** Parts that are detail hotspots only (not independently draggable layers) */
export const DETAIL_HOTSPOT_IDS: HotspotId[] = [
  'handguard',
  'barrel',
  'gasBlock',
  'stock',
  'pistolGrip',
  'ambiControls',
  'e32Bolt',
]
