import { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, PixelRatio, type LayoutChangeEvent } from 'react-native'
import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl'
import { vertex, fragment } from './animatedBackgroundShader.glsl'

// Native (iOS/Android) build of AnimatedBackgroundShader, picked automatically by Metro's
// platform-extension resolution. Same GLSL as the web/ogl build (AnimatedBackgroundShader.web.tsx,
// shared via animatedBackgroundShader.glsl.ts) but driven with raw expo-gl calls instead of ogl,
// since ogl expects a browser canvas/WebGL context that doesn't exist on native — expo-gl's
// GLView hands us a real (if slightly non-standard) WebGLRenderingContext to draw into instead.

function compileShader(gl: ExpoWebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('AnimatedBackgroundShader: shader compile failed:', gl.getShaderInfoLog(shader))
  }
  return shader
}

function onContextCreate(gl: ExpoWebGLRenderingContext, size: number) {
  const program = gl.createProgram()!
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertex))
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragment))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('AnimatedBackgroundShader: program link failed:', gl.getProgramInfoLog(program))
  }
  gl.useProgram(program)

  // Same oversized single-triangle trick as ogl's Triangle geometry: one triangle whose
  // visible slice covers the whole clip space, cheaper to rasterize than a two-triangle quad.
  const positions = new Float32Array([-1, -1, 3, -1, -1, 3])
  const uvs = new Float32Array([0, 0, 2, 0, 0, 2])

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  const positionLoc = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

  const uvBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)
  const uvLoc = gl.getAttribLocation(program, 'uv')
  gl.enableVertexAttribArray(uvLoc)
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)

  const uTimeLoc = gl.getUniformLocation(program, 'uTime')
  const uResolutionLoc = gl.getUniformLocation(program, 'uResolution')
  const uSizeLoc = gl.getUniformLocation(program, 'uSize')

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.uniform2f(uResolutionLoc, gl.drawingBufferWidth, gl.drawingBufferHeight)
  // drawingBufferWidth/Height are device pixels; size is meant in logical (CSS-like) pixels
  // as on web (dpr: 1 there), so scale it up to match or the grid squares end up tiny.
  gl.uniform1f(uSizeLoc, size * PixelRatio.get())

  let rafId: number
  const start = Date.now()
  const render = () => {
    gl.uniform1f(uTimeLoc, (Date.now() - start) / 1000)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.flush()
    gl.endFrameEXP()
    rafId = requestAnimationFrame(render)
  }
  rafId = requestAnimationFrame(render)

  return () => cancelAnimationFrame(rafId)
}

export default function AnimatedBackgroundShader({ size = 17 }) {
  const cleanupRef = useRef<(() => void) | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => () => cleanupRef.current?.(), [])

  // GLView sizes its drawing buffer once at creation; if the layout size changes (e.g.
  // rotation) remount the view so onContextCreate re-reads the new drawingBufferWidth/Height.
  const layoutSizeRef = useRef({ width: 0, height: 0 })
  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    if (width !== layoutSizeRef.current.width || height !== layoutSizeRef.current.height) {
      layoutSizeRef.current = { width, height }
      setKey((k) => k + 1)
    }
  }

  return (
    <View style={styles.container} pointerEvents="none" onLayout={handleLayout}>
      <GLView
        key={key}
        style={styles.glview}
        msaaSamples={4}
        enableExperimentalWorkletSupport={false}
        onContextCreate={(gl) => {
          cleanupRef.current?.()
          cleanupRef.current = onContextCreate(gl as ExpoWebGLRenderingContext, size)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  glview: {
    flex: 1,
  },
})
