import { useMemo, useRef, useState } from 'react'
import {
  HOTSPOTS,
  PARTS,
  REMOVE_ORDER,
  INSTALL_ORDER,
  RIFLE_ORIGIN,
  type HotspotId,
  type PartId,
} from './data/parts'
import { AssembledOffsets, PartVisual } from './components/PartVisuals'
import './App.css'

type Mode = 'guided' | 'free'

interface PartState {
  installed: boolean
  x: number
  y: number
}

function homePos(id: PartId) {
  const o = AssembledOffsets(id)
  return { x: RIFLE_ORIGIN.x + o.x, y: RIFLE_ORIGIN.y + o.y }
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

function canRemove(id: PartId, parts: Record<PartId, PartState>, mode: Mode) {
  if (id === 'lower' || !parts[id].installed) return false
  if (!depsRemoved(id, parts)) return false
  if (mode === 'guided') return nextRemove(parts) === id
  return true
}

function canInstall(id: PartId, parts: Record<PartId, PartState>, mode: Mode) {
  if (parts[id].installed || id === 'lower') return false
  if (!depsInstalled(id, parts)) return false
  if (mode === 'guided') return nextInstall(parts) === id
  return true
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
  const [hover, setHover] = useState<HotspotId | null>(null)
  const [dragging, setDragging] = useState<PartId | null>(null)
  const [message, setMessage] = useState(
    'Hover for info · drag parts to strip · snap back to rebuild',
  )
  const [pulse, setPulse] = useState(false)

  const dragOffset = useRef({ x: 0, y: 0 })
  const dragStartedInstalled = useRef(false)
  const partsRef = useRef(parts)
  partsRef.current = parts

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

  const hint = useMemo(() => {
    if (mode === 'free') return 'Free mode — any dependency-valid move.'
    const n = nextRemove(parts)
    if (n) return `Guided · remove ${PARTS[n].shortName}`
    const i = nextInstall(parts)
    if (i) return `Guided · install ${PARTS[i].shortName}`
    return 'Guided · fully assembled'
  }, [mode, parts])

  function notify(text: string, ok = false) {
    setMessage(text)
    if (ok) {
      setPulse(true)
      window.setTimeout(() => setPulse(false), 500)
    }
  }

  function reset() {
    setParts(initialParts())
    setDragging(null)
    setHover(null)
    notify('Rifle reset on the bench.')
  }

  function autoStrip() {
    setParts((prev) => {
      const next = { ...prev }
      for (const id of REMOVE_ORDER) {
        next[id] = { installed: false, x: PARTS[id].tray.x, y: PARTS[id].tray.y }
      }
      return next
    })
    notify('Field-stripped. Drag parts onto ghost outlines to rebuild.', true)
  }

  function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    return pt.matrixTransform(svg.getScreenCTM()!.inverse())
  }

  function onPointerDown(id: PartId, e: React.PointerEvent<SVGGElement>) {
    if (id === 'lower') return
    const snapshot = partsRef.current
    if (snapshot[id].installed && !canRemove(id, snapshot, mode)) {
      notify(
        mode === 'guided'
          ? `Guided: remove ${PARTS[nextRemove(snapshot)!].shortName} first.`
          : `Remove required parts before ${PARTS[id].shortName}.`,
      )
      return
    }

    e.preventDefault()
    e.stopPropagation()
    const g = e.currentTarget
    g.setPointerCapture(e.pointerId)
    const svg = g.ownerSVGElement!
    const cursor = clientToSvg(svg, e.clientX, e.clientY)
    const p = snapshot[id]
    dragOffset.current = { x: cursor.x - p.x, y: cursor.y - p.y }
    dragStartedInstalled.current = p.installed
    setDragging(id)
    setHover(id)

    if (p.installed) {
      setParts((prev) => ({
        ...prev,
        [id]: { ...prev[id], installed: false },
      }))
    }
  }

  function onPointerMove(e: React.PointerEvent<SVGGElement>) {
    if (!dragging) return
    const svg = e.currentTarget.ownerSVGElement!
    const cursor = clientToSvg(svg, e.clientX, e.clientY)
    setParts((prev) => ({
      ...prev,
      [dragging]: {
        installed: false,
        x: cursor.x - dragOffset.current.x,
        y: cursor.y - dragOffset.current.y,
      },
    }))
  }

  function onPointerUp(e: React.PointerEvent<SVGGElement>) {
    if (!dragging) return
    const id = dragging
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }

    setParts((prev) => {
      const current = prev[id]
      const home = homePos(id)
      const dist = Math.hypot(current.x - home.x, current.y - home.y)
      const near = dist < PARTS[id].snapRadius

      // Treat as uninstalled for install checks
      const asLoose = { ...prev, [id]: { ...current, installed: false } }

      if (near && canInstall(id, asLoose, mode)) {
        notify(`Installed ${PARTS[id].name}.`, true)
        return { ...prev, [id]: { installed: true, x: home.x, y: home.y } }
      }

      if (near && !canInstall(id, asLoose, mode)) {
        notify(`Cannot install ${PARTS[id].shortName} yet — ${hint}`)
        return {
          ...prev,
          [id]: {
            installed: false,
            x: PARTS[id].tray.x,
            y: PARTS[id].tray.y,
          },
        }
      }

      // Dropped off-rifle
      if (dragStartedInstalled.current) {
        // Already marked uninstalled at drag start; keep position
        notify(`Removed ${PARTS[id].name}.`)
        return { ...prev, [id]: { installed: false, x: current.x, y: current.y } }
      }

      notify(`${PARTS[id].shortName} on the tray.`)
      return { ...prev, [id]: { installed: false, x: current.x, y: current.y } }
    })

    setDragging(null)
  }

  function hotspotVisible(hsId: HotspotId) {
    const hs = HOTSPOTS.find((h) => h.id === hsId)!
    if (hs.visibleWhenInstalled?.some((p) => !parts[p].installed)) return false
    if (hs.visibleWhenRemoved?.some((p) => parts[p].installed)) return false
    return true
  }

  function shouldRender(id: PartId) {
    const p = parts[id]
    if (id === 'lower') return true
    if (!p.installed && dragging !== id) {
      // always show loose parts
      return true
    }
    if (p.installed || dragging === id) {
      if (id === 'magazine') return parts.lower.installed || dragging === id
      if (id === 'upper') return true
      if (['optic', 'suppressor', 'chargingHandle', 'boltCarrier'].includes(id)) {
        return parts.upper.installed || dragging === id || !p.installed
      }
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
          className="bench"
          viewBox="0 0 1280 720"
          role="img"
          aria-label="L403A1 workbench, top-down"
        >
          <defs>
            <linearGradient id="tableGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#534636" />
              <stop offset="45%" stopColor="#3d3428" />
              <stop offset="100%" stopColor="#2a241c" />
            </linearGradient>
            <pattern id="grain" width="160" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 H160 M80 0 V100" stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
              <path d="M0 0 L160 100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
            <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="8" stdDeviation="7" floodOpacity="0.5" />
            </filter>
          </defs>

          <rect width="1280" height="720" fill="url(#tableGrad)" />
          <rect width="1280" height="720" fill="url(#grain)" />
          <ellipse cx="640" cy="320" rx="540" ry="150" fill="rgba(0,0,0,0.2)" />

          <rect
            className="tray"
            x="36"
            y="468"
            width="1208"
            height="226"
            rx="14"
          />
          <text x="60" y="496" className="tray-label">
            PARTS TRAY — drag components here to remove · drag onto ghost outlines to reassemble
          </text>

          {DRAW_ORDER.map((id) => {
            if (!shouldRender(id)) return null
            const p = parts[id]
            const home = homePos(id)
            const showGhost = !p.installed && id !== 'lower'
            const locked =
              id === 'lower' || (p.installed && !canRemove(id, parts, mode) && dragging !== id)

            return (
              <g key={id}>
                {showGhost && (
                  <g
                    transform={`translate(${home.x} ${home.y})`}
                    className="snap-ghost"
                    pointerEvents="none"
                  >
                    <PartVisual id={id} dimmed />
                  </g>
                )}
                <g
                  transform={`translate(${p.x} ${p.y})`}
                  className={[
                    'part',
                    locked ? 'locked' : 'draggable',
                    dragging === id ? 'dragging' : '',
                    p.installed ? 'installed' : 'loose',
                  ].join(' ')}
                  filter="url(#softShadow)"
                  onPointerDown={locked ? undefined : (e) => onPointerDown(id, e)}
                  onPointerMove={dragging === id ? onPointerMove : undefined}
                  onPointerUp={dragging === id ? onPointerUp : undefined}
                  onPointerCancel={dragging === id ? onPointerUp : undefined}
                  onPointerEnter={() => !dragging && setHover(id)}
                  onPointerLeave={() => setHover((h) => (h === id ? null : h))}
                  style={{ touchAction: 'none' }}
                >
                  <PartVisual id={id} />
                </g>
              </g>
            )
          })}

          {/* Detail hotspots above art; skips ids that are themselves draggable parts */}
          <g
            transform={`translate(${RIFLE_ORIGIN.x} ${RIFLE_ORIGIN.y})`}
            className={dragging ? 'hotspots-disabled' : ''}
          >
            {HOTSPOTS.filter(
              (hs) =>
                !['magazine', 'suppressor', 'optic', 'chargingHandle', 'boltCarrier', 'upper', 'lower'].includes(
                  hs.id,
                ),
            ).map((hs) =>
              hotspotVisible(hs.id) ? (
                <path
                  key={hs.id}
                  d={hs.path}
                  className={`hotspot ${hover === hs.id ? 'hot' : ''}`}
                  onPointerEnter={() => !dragging && setHover(hs.id)}
                  onPointerLeave={() => setHover((h) => (h === hs.id ? null : h))}
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
