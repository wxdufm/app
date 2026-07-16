import { useEffect, useRef } from 'react'
import { vertex, fragment } from './animatedBackgroundShader.glsl'

// GPU-shader version of AnimatedBackgroundInverted: same visual (black squares whose
// size drifts with noise, over a slowly-cycling muted HSB background) but the whole
// thing runs as a single fullscreen GLSL fragment shader on the GPU instead of ~thousands
// of per-square canvas2D draw calls on the main thread. Uses the `ogl` WebGL library,
// so it never competes with scroll/input.
// This is the web build (Metro picks this file for web via the .web.tsx extension);
// see AnimatedBackgroundShader.native.tsx for the expo-gl reimplementation used on
// iOS/Android, since ogl and this component's window/document/canvas usage are web-only.

export default function AnimatedBackgroundShader({ size = 17 }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let renderer: any, program: any, mesh: any, canvas: HTMLCanvasElement | undefined
    let rafId: number | null = null
    let onResize: (() => void) | undefined
    let onVisibilityChange: (() => void) | undefined
    let destroyed = false

    // ogl only touches the DOM/WebGL context, so it's loaded dynamically to keep it
    // out of the SSR bundle entirely.
    import('ogl').then(({ Renderer, Program, Mesh, Triangle }) => {
      // effect cleanup can fire before this promise resolves (fast route change); bail out
      // rather than mounting a canvas into a container that's already gone.
      if (destroyed || !containerRef.current) return

      // dpr: 1 skips retina's 4x pixel fill; antialias: false is redundant work since
      // the shader already anti-aliases its own square edges via smoothstep.
      renderer = new Renderer({ dpr: 1, alpha: false, antialias: false })
      const gl = renderer.gl
      canvas = gl.canvas as HTMLCanvasElement
      canvas.style.display = 'block'
      containerRef.current.appendChild(canvas)

      // One triangle, one shader program, one mesh; the entire "scene" is a single
      // draw call every frame, vs. thousands of individual rect() calls in the old version.
      const geometry = new Triangle(gl)
      program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [window.innerWidth, window.innerHeight] },
          uSize: { value: size },
        },
      })
      mesh = new Mesh(gl, { geometry, program })

      // Resize the actual GL framebuffer and tell the shader the new pixel dimensions
      // (uResolution) so grid cells stay screen-space-sized instead of stretching.
      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height]
      }
      onResize = resize
      resize()
      window.addEventListener('resize', onResize)

      // Feed elapsed seconds into the shader each frame and issue the draw call.
      // All animation state (noise offsets, hue) lives in the shader now.
      const start = performance.now()
      const update = (t: number) => {
        program.uniforms.uTime.value = (t - start) / 1000
        renderer.render({ scene: mesh })
        rafId = requestAnimationFrame(update)
      }

      // Same idea as the old canvas2D pause-on-hide, but here it's just gating
      // requestAnimationFrame since there's no p5 loop() / noLoop() API to call.
      onVisibilityChange = () => {
        if (document.hidden) {
          if (rafId) cancelAnimationFrame(rafId)
          rafId = null
        } else if (!rafId) {
          rafId = requestAnimationFrame(update)
        }
      }
      document.addEventListener('visibilitychange', onVisibilityChange)

      rafId = requestAnimationFrame(update)
    })

    return () => {
      destroyed = true
      if (rafId) cancelAnimationFrame(rafId)
      if (onResize) window.removeEventListener('resize', onResize)
      if (onVisibilityChange) document.removeEventListener('visibilitychange', onVisibilityChange)
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [size])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
