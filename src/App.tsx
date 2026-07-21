import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DETAIL_HOTSPOT_IDS,
  HOTSPOTS,
  PARTS,
  REMOVE_ORDER,
  INSTALL_ORDER,
  RIFLE_ORIGIN,
  type HotspotId,
  type PartId,
} from './data/parts'
import { AssembledOffsets, PartHitArea, PartVisual } from './components/PartVisuals'
import './App.css'

type Mode = 'guided' | 'free'
type Phase = 'strip' | 'rebuild'

interface PartState {
  installed: boolean
  x: number
  y: number
}

function homePos(id: PartId) {
  const o = AssembledOffsets(id)
  return { x: RIFLE_ORIGIN.x + o.x, y: RIFLE_ORIGIN.y + o.y }
}

function trayPos(id: PartId) {
  return { x: PARTS[id].tray.x, y: PARTS[id].tray.y }
}

function initialParts(): Record<PartId, PartState> {
  const state = {} as Record<PartId, PartState>
  for (const id of Object.keys(PARTS) as PartId[]) {
    const h = homePos(id)
    state[id] = { installed: true, x: h.x, y: h.y }
  }
  return state
}

function depsRemoved(id: PartId, parts: Record<PartId, PartState>) {
  return PARTS[id].requiresRemoved.every((r) => !parts[r].installed)
}

function depsInstalled(id: PartId, parts: Record<PartId, PartState>) {
  return PARTS[id].requiresInstalled.every((r) => parts[r].installed)
}

function nextRemove(parts: Record<PartId, PartState>): PartId | undefined {
  return REMOVE_ORDER.find((p) => parts[p].installed)
}

function nextInstall(parts: Record<PartId, PartState>): PartId | undefined {
  return INSTALL_ORDER.find((p) => !parts[p].installed)
}

function canRemove(
  id: PartId,
  parts: Record<PartId, PartState>,
  mode: Mode,
  phase: Phase,
) {
  if (id === 'lower' || !parts[id].installed) return false
  if (!depsRemoved(id, parts)) return false
  if (mode === 'guided') return phase === 'strip' && nextRemove(parts) === id
  return true
}

function canInstall(
  id: PartId,
  parts: Record<PartId, PartState>,
  mode: Mode,
  phase: Phase,
) {
  if (parts[id].installed || id === 'lower') return false
  if (!depsInstalled(id, parts)) return false
  if (mode === 'guided') return phase === 'rebuild' && nextInstall(parts) === id
  return true
}

function syncPhase(parts: Record<PartId, PartState>, phase: Phase): Phase {
  if (REMOVE_ORDER.every((p) => !parts[p].installed)) return 'rebuild'
  if (REMOVE_ORDER.every((p) => parts[p].installed)) return 'strip'
  return phase
}

const DRAW_ORDER: PartId[] = [
  'lower',
  'upper',
  'boltCarrier',
  'chargingHandle',
  'optic',
  'suppressor',
  'magazine',
]

export default function App() {
  const [parts, setParts] = useState(initialParts)
  const [mode, setMode] = useState<Mode>('guided')
  const [phase, setPhase] = useState<Phase>('strip')
  const [hover, setHover] = useState<HotspotId | null>(null)
  const [dragging, setDragging] = useState<PartId | null>(null)
  const [message, setMessage] = useState(
    'Hover for info · drag parts to strip · snap ghosts to rebuild',
  )
  const [pulse, setPulse] = useState(false)

  const svgRef = useRef<SVGSVGElement | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragStartedInstalled = useRef(false)
  const dragIdRef = useRef<PartId | null>(null)
  const partsRef = useRef(parts)
  const modeRef = useRef(mode)
  const phaseRef = useRef(phase)
  partsRef.current = parts
  modeRef.current = mode
  phaseRef.current = phase

  const activeInfo = useMemo(() => {
    const id = hover ?? dragging
    if (!id) return null
    const hs = HOTSPOTS.find((h) => h.id === id)
    if (hs) return { name: hs.name, description: hs.description, facts: hs.facts }
    if (id in PARTS) {
      const p = PARTS[id as PartId]
      return { name: p.name, description: p.description, facts: p.facts }
    }
    return null
  }, [hover, dragging])

  const guidedTarget = useMemo(() => {
    if (mode !== 'guided') return null
    if (phase === 'strip') return nextRemove(parts) ?? null
    return nextInstall(parts) ?? null
  }, [mode, phase, parts])

  const hint = useMemo(() => {
    if (mode === 'free') return 'Free mode — any dependency-valid move.'
    if (phase === 'strip') {
      const n = nextRemove(parts)
      if (!n) return 'Guided · fully stripped — install Upper'
      if (REMOVE_ORDER.every((p) => parts[p].installed)) {
        return 'Guided · fully assembled — remove Mag to begin'
      }
      return `Guided · remove ${PARTS[n].shortName}`
    }
    const i = nextInstall(parts)
    if (!i) return 'Guided · fully assembled'
    return `Guided · install ${PARTS[i].shortName}`
  }, [mode, phase, parts])

  function notify(text: string, ok = false) {
    setMessage(text)
    if (ok) {
      setPulse(true)
      window.setTimeout(() => setPulse(false), 500)
    }
  }

  function reset() {
    setParts(initialParts())
    setPhase('strip')
    setDragging(null)
    dragIdRef.current = null
    setHover(null)
    notify('Rifle reset on the bench.')
  }

  function autoStrip() {
    setParts((prev) => {
      const next = { ...prev }
      for (const id of REMOVE_ORDER) {
        const t = trayPos(id)
        next[id] = { installed: false, x: t.x, y: t.y }
      }
      return next
    })
    setPhase('rebuild')
    notify('Field-stripped. Drag parts onto ghost outlines to rebuild.', true)
  }

  function clientToSvg(clientX: number, clientY: number) {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return { x: 0, y: 0 }
    return pt.matrixTransform(ctm.inverse())
  }

  function finishDrag(clientX: number, clientY: number) {
    const id = dragIdRef.current
    if (!id) return

    const cursor = clientToSvg(clientX, clientY)
    const x = cursor.x - dragOffset.current.x
    const y = cursor.y - dragOffset.current.y
    const home = homePos(id)
    const dist = Math.hypot(x - home.x, y - home.y)
    const near = dist < PARTS[id].snapRadius
    const modeNow = modeRef.current
    const phaseNow = phaseRef.current
    const startedInstalled = dragStartedInstalled.current
    const prev = partsRef.current
    const asLoose: Record<PartId, PartState> = {
      ...prev,
      [id]: { installed: false, x, y },
    }

    let next: Record<PartId, PartState>
    if (near && canInstall(id, asLoose, modeNow, phaseNow)) {
      next = { ...prev, [id]: { installed: true, x: home.x, y: home.y } }
      notify(`Installed ${PARTS[id].name}.`, true)
    } else if (near && !canInstall(id, asLoose, modeNow, phaseNow)) {
      const t = trayPos(id)
      next = { ...prev, [id]: { installed: false, x: t.x, y: t.y } }
      notify(
        modeNow === 'guided'
          ? phaseNow === 'strip'
            ? 'Guided: finish stripping before reinstalling.'
            : `Guided: install ${PARTS[nextInstall(asLoose)!]?.shortName ?? 'next part'} first.`
          : `Dependencies not met for ${PARTS[id].shortName}.`,
      )
    } else {
      const t = trayPos(id)
      next = { ...prev, [id]: { installed: false, x: t.x, y: t.y } }
      notify(startedInstalled ? `Removed ${PARTS[id].name}.` : `${PARTS[id].shortName} on the tray.`)
    }

    setParts(next)
    setPhase(syncPhase(next, phaseNow))
    dragIdRef.current = null
    setDragging(null)
  }

  useEffect(() => {
    if (!dragging) return

    function onMove(e: PointerEvent) {
      const id = dragIdRef.current
      if (!id) return
      e.preventDefault()
      const cursor = clientToSvg(e.clientX, e.clientY)
      setParts((prev) => ({
        ...prev,
        [id]: {
          installed: false,
          x: cursor.x - dragOffset.current.x,
          y: cursor.y - dragOffset.current.y,
        },
      }))
    }

    function onUp(e: PointerEvent) {
      finishDrag(e.clientX, e.clientY)
    }

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging])

  function onPointerDown(id: PartId, e: React.PointerEvent<SVGGElement>) {
    if (id === 'lower') return
    const snapshot = partsRef.current
    const modeNow = modeRef.current
    const phaseNow = phaseRef.current

    if (snapshot[id].installed && !canRemove(id, snapshot, modeNow, phaseNow)) {
      notify(
        modeNow === 'guided'
          ? phaseNow === 'rebuild'
            ? `Guided: install ${PARTS[nextInstall(snapshot)!]?.shortName ?? 'next part'} — stripping is done.`
            : `Guided: remove ${PARTS[nextRemove(snapshot)!].shortName} first.`
          : `Remove required parts before ${PARTS[id].shortName}.`,
      )
      return
    }

    e.preventDefault()
    e.stopPropagation()

    const cursor = clientToSvg(e.clientX, e.clientY)
    const p = snapshot[id]
    dragOffset.current = { x: cursor.x - p.x, y: cursor.y - p.y }
    dragStartedInstalled.current = p.installed
    dragIdRef.current = id
    setDragging(id)
    setHover(id)

    if (p.installed) {
      setParts((prev) => ({
        ...prev,
        [id]: { ...prev[id], installed: false },
      }))
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* capture optional — window listeners handle move/up */
    }
  }

  function hotspotVisible(hsId: HotspotId) {
    const hs = HOTSPOTS.find((h) => h.id === hsId)!
    if (hs.visibleWhenInstalled?.some((p) => !parts[p].installed)) return false
    if (hs.visibleWhenRemoved?.some((p) => parts[p].installed)) return false
    return true
  }

  function pointInHotspot(hs: (typeof HOTSPOTS)[number], x: number, y: number) {
    // Hotspot paths are axis-aligned rects: M x y H x2 V y2 H x Z (local to rifle origin)
    const m = /M\s*([-\d.]+)\s+([-\d.]+)\s+H\s*([-\d.]+)\s+V\s*([-\d.]+)/i.exec(hs.path)
    if (!m) return false
    const x1 = Math.min(+m[1], +m[3])
    const x2 = Math.max(+m[1], +m[3])
    const y1 = Math.min(+m[2], +m[4])
    const y2 = Math.max(+m[2], +m[4])
    const lx = x - RIFLE_ORIGIN.x
    const ly = y - RIFLE_ORIGIN.y
    return lx >= x1 && lx <= x2 && ly >= y1 && ly <= y2
  }

  function onBenchPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (dragging) return
    const cursor = clientToSvg(e.clientX, e.clientY)
    const hit = HOTSPOTS.filter(
      (hs) => DETAIL_HOTSPOT_IDS.includes(hs.id) && hotspotVisible(hs.id),
    ).find((hs) => pointInHotspot(hs, cursor.x, cursor.y))
    setHover((prev) => {
      // Prefer keeping a part hover if pointer is over a part (parts set hover themselves).
      // Only set detail hotspot when we hit one; clear detail hotspot when leaving.
      if (hit) return hit.id
      if (prev && DETAIL_HOTSPOT_IDS.includes(prev)) return null
      return prev
    })
  }

  function shouldRender(id: PartId) {
    const p = parts[id]
    if (id === 'lower') return true
    if (!p.installed || dragging === id) return true
    if (id === 'magazine') return parts.lower.installed
    if (['optic', 'suppressor', 'chargingHandle', 'boltCarrier'].includes(id)) {
      return parts.upper.installed
    }
    return true
  }

  return (
    <div className={`app ${pulse ? 'pulse' : ''}`}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">L403A1</span>
          <span className="brand-sub">Field Strip Trainer · KS-1 / AIW</span>
        </div>
        <div className="controls">
          <div className="mode-toggle" role="group" aria-label="Interaction mode">
            <button
              type="button"
              className={mode === 'guided' ? 'active' : ''}
              onClick={() => setMode('guided')}
            >
              Guided
            </button>
            <button
              type="button"
              className={mode === 'free' ? 'active' : ''}
              onClick={() => setMode('free')}
            >
              Free
            </button>
          </div>
          <button type="button" className="ghost" onClick={autoStrip}>
            Auto strip
          </button>
          <button type="button" className="ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </header>

      <div className="workspace">
        <svg
          ref={svgRef}
          className="bench"
          viewBox="0 0 1280 720"
          role="img"
          aria-label="L403A1 workbench, top-down"
          onPointerMove={onBenchPointerMove}
        >
          <defs>
            <linearGradient id="tableGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5a4a36" />
              <stop offset="40%" stopColor="#3f3428" />
              <stop offset="100%" stopColor="#2a2218" />
            </linearGradient>
            <linearGradient id="matGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e342c" />
              <stop offset="100%" stopColor="#1e2420" />
            </linearGradient>
            <pattern id="grain" width="180" height="120" patternUnits="userSpaceOnUse">
              <path d="M0 40 H180 M0 80 H180" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
              <path d="M40 0 V120 M90 0 V120 M140 0 V120" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
              <path d="M0 0 L180 120" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
            </pattern>
            <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.55" />
            </filter>
            <filter id="glowAccent" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#c4a35a" floodOpacity="0.55" />
            </filter>
          </defs>

          <rect width="1280" height="720" fill="url(#tableGrad)" />
          <rect width="1280" height="720" fill="url(#grain)" />

          {/* Bench mat under the rifle */}
          <rect
            x="48"
            y="96"
            width="1184"
            height="340"
            rx="18"
            fill="url(#matGrad)"
            opacity="0.72"
          />
          <rect
            x="48"
            y="96"
            width="1184"
            height="340"
            rx="18"
            fill="none"
            stroke="rgba(196,163,90,0.12)"
            strokeWidth="1"
          />
          <ellipse cx="640" cy="300" rx="500" ry="110" fill="rgba(0,0,0,0.22)" />

          <text x="72" y="128" className="bench-caption">
            BENCH SCHEMATIC · L403A1 / KS-1
          </text>

          <rect className="tray" x="36" y="468" width="1208" height="226" rx="14" />
          <text x="60" y="496" className="tray-label">
            PARTS TRAY — drag here to remove · drag onto ghost outlines to reassemble
          </text>

          {DRAW_ORDER.map((id) => {
            if (!shouldRender(id)) return null
            const p = parts[id]
            const home = homePos(id)
            const showGhost = !p.installed && id !== 'lower'
            const locked =
              id === 'lower' ||
              (p.installed && !canRemove(id, parts, mode, phase) && dragging !== id)
            const isTarget = guidedTarget === id && dragging !== id

            return (
              <g key={id}>
                {showGhost && (
                  <g
                    transform={`translate(${home.x} ${home.y})`}
                    className={`snap-ghost ${isTarget ? 'snap-ghost-target' : ''}`}
                    pointerEvents="none"
                  >
                    <PartVisual id={id} dimmed highlight={isTarget} />
                  </g>
                )}
                <g
                  transform={`translate(${p.x} ${p.y})`}
                  className={[
                    'part',
                    locked ? 'locked' : 'draggable',
                    dragging === id ? 'dragging' : '',
                    p.installed ? 'installed' : 'loose',
                    isTarget && p.installed ? 'guided-target' : '',
                  ].join(' ')}
                  filter={
                    isTarget && p.installed
                      ? 'url(#glowAccent)'
                      : 'url(#softShadow)'
                  }
                  onPointerDown={locked ? undefined : (e) => onPointerDown(id, e)}
                  onPointerEnter={() => !dragging && setHover(id)}
                  onPointerLeave={() => setHover((h) => (h === id ? null : h))}
                  style={{ touchAction: 'none' }}
                >
                  <PartHitArea id={id} />
                  <PartVisual id={id} highlight={isTarget && p.installed} />
                </g>
              </g>
            )
          })}

          {/* Detail hotspots — visual only; hover via SVG pointer hit-test so they never block drags */}
          <g
            transform={`translate(${RIFLE_ORIGIN.x} ${RIFLE_ORIGIN.y})`}
            className="hotspots-layer"
            pointerEvents="none"
          >
            {HOTSPOTS.filter((hs) => DETAIL_HOTSPOT_IDS.includes(hs.id)).map((hs) =>
              hotspotVisible(hs.id) ? (
                <path
                  key={hs.id}
                  d={hs.path}
                  className={`hotspot ${hover === hs.id ? 'hot' : ''}`}
                />
              ) : null,
            )}
          </g>
        </svg>

        <aside className={`info-panel ${activeInfo ? 'has-info' : ''}`}>
          {activeInfo ? (
            <>
              <p className="info-kicker">Component</p>
              <h2>{activeInfo.name}</h2>
              <p className="info-body">{activeInfo.description}</p>
              <ul>
                {activeInfo.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="info-kicker">Workbench</p>
              <h2>L403A1 · Alternative Individual Weapon</h2>
              <p className="info-body">
                Interactive bench trainer for the Knight’s Armament KS-1 adopted as the L403A1.
                Hover hotspots for specs. Drag to field-strip; snap parts back onto the ghost
                outlines to reassemble.
              </p>
              <ul>
                <li>Guided mode walks a standard strip / rebuild order</li>
                <li>Free mode allows any move that respects dependencies</li>
                <li>Lower receiver stays as the reassembly anchor</li>
              </ul>
            </>
          )}
          <div className="status-row">
            <span className="hint">{hint}</span>
            <span className="status-msg">{message}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
