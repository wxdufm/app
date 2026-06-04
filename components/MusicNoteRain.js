import { useEffect, useRef } from 'react'

const NOTES = '♩♪♫♬♭♮♯'.split('')
const CW = 14, CH = 19, FS = 16

const SHAPES = {
  record: [
    '        XXXXXXX        ',
    '     XXXXXXXXXXXXX     ',
    '   XXXXXXXXXXXXXXXXX   ',
    '  XXXXXXXXXXXXXXXXXXX  ',
    ' XXXXXXXXXXXXXXXXXXXXX ',
    ' XXXXXXXXX XXXXXXXXXX ',
    ' XXXXXXXXX XXXXXXXXXXX ',
    '  XXXXXXXXXXXXXXXXXXX  ',
    '   XXXXXXXXXXXXXXXXX   ',
    '     XXXXXXXXXXXXX     ',
    '        XXXXXXX        ',
  ],
  cassette: [
    'XXXXXXXXXXXXXXXXXXXXXXXX',
    'X                      X',
    'X   XXXXX     XXXXX    X',
    'X  X  X  X   X  X  X   X',
    'X   XXXXX     XXXXX    X',
    'X       XXXXXXXX       X',
    'X                      X',
    'XXXXXXXXXXXXXXXXXXXXXXXX',
  ],
  cd: [
    '        XXXXXXX        ',
    '     XXXXXXXXXXXXX     ',
    '   XX             XX   ',
    '  X                 X  ',
    '  X    XXXXXXXXX    X  ',
    '  X   X    X    X   X  ',
    '  X    XXXXXXXXX    X  ',
    '  X                 X  ',
    '   XX             XX   ',
    '     XXXXXXXXXXXXX     ',
    '        XXXXXXX        ',
  ],
  boombox: [
    'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'X                         X',
    'X XXXXX  XXXXXXXXX  XXXXX X',
    'X X   X  X       X  X   X X',
    'X X   X  X  XXX  X  X   X X',
    'X XXXXX  XXXXXXXXX  XXXXX X',
    'X                         X',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  ],
  headphones: [
    '       XXXXXXXXX       ',
    '     XX         XX     ',
    '    X             X    ',
    '  XXX               XXX',
    '  X X               X X',
    '  XXX               XXX',
  ],
}

const SHAPE_KEYS = Object.keys(SHAPES)
const getShapeW = t => Math.max(...SHAPES[t].map(r => r.length)) * CW
const getShapeH = t => SHAPES[t].length * CH

function makeGrid(type) {
  return SHAPES[type].map(row =>
    Array.from(row).map(ch => ch !== ' ' ? Math.floor(Math.random() * 7) : -1)
  )
}

function createObject(initX, W, H) {
  const type = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)]
  const h = getShapeH(type), padding = 30
  return {
    type,
    grid: makeGrid(type),
    x: initX !== undefined ? initX : -(getShapeW(type) + 10),
    y: padding + Math.random() * Math.max(1, H - h - padding * 2),
    speed: 0.5 + Math.random() * 0.85,
    opacity: 0.32 + Math.random() * 0.52,
    bobPhase: Math.random() * Math.PI * 2,
    bobAmp: 2 + Math.random() * 7,
  }
}

export default function MusicAsciiBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let W = canvas.width, H = canvas.height

    // Seed two objects already mid-journey so the canvas isn't empty on load
    const obj1 = createObject(W * 0.06, W, H); obj1.opacity = 0.72
    const obj2 = createObject(W * 0.63, W, H); obj2.opacity = 0.50
    let objects = [obj1, obj2]

    let nextSpawn = 4200
    let tick = 0
    let raf

    const draw = (ts) => {
      tick++
      W = canvas.width; H = canvas.height

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      // Spawn from the left when under the 3-object cap
      if ((ts > nextSpawn && objects.length < 3) || objects.length === 0) {
        objects.push(createObject(undefined, W, H))
        nextSpawn = ts + 2000 + Math.random() * 3200
      }

      // Cull objects that have fully exited the right edge
      objects = objects.filter(o => o.x < W + 80)

      ctx.font = `${FS}px "Courier New", monospace`
      ctx.textBaseline = 'top'
      ctx.fillStyle = '#fff'

      for (const obj of objects) {
        obj.x += obj.speed
        const bobY = Math.sin(ts * 0.0007 + obj.bobPhase) * obj.bobAmp

        // Shimmer: slowly swap ~11% of note chars each tick-group
        if (tick % 9 === 0) {
          obj.grid.forEach(row => {
            row.forEach((val, i, arr) => {
              if (val >= 0 && Math.random() < 0.11) arr[i] = Math.floor(Math.random() * 7)
            })
          })
        }

        ctx.globalAlpha = obj.opacity
        obj.grid.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val >= 0) ctx.fillText(NOTES[val], obj.x + c * CW, obj.y + bobY + r * CH)
          })
        })
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}