// Shared GLSL source for AnimatedBackgroundShader, used by both the ogl-based web build
// (AnimatedBackgroundShader.web.tsx) and the expo-gl-based native build
// (AnimatedBackgroundShader.native.tsx) so the two platforms stay pixel-identical.

export const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

export const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uSize;
  varying vec2 vUv;

  // Simplex 3D noise (Ashima Arts / Ian McEwan, webgl-noise) for smooth effect
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  // converter from hsb to rgb
  vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    // PIXEL POSITION: vUv is 0..1 across the screen; scale up to actual pixel coordinates so
    // uSize (a pixel value) means the same thing here.
    vec2 fragCoord = vUv * uResolution;

    // BG COLOR: Background hue drifts over time only (no spatial input), so every pixel this
    // frame gets the same hue — one continuous color wash.
    float bgHue = snoise(vec3(uTime * 0.03, 0.0, 0.0)) * 0.5 + 0.5;
    vec3 bgColor = hsb2rgb(vec3(bgHue, 0.4, 0.55));

    // WHICH GRID SQUARE + DISTANCE FROM CENTER CALCULATION. Every pixel independently
    // figures out its own cell in parallel.
    vec2 cell = floor(fragCoord / uSize);
    vec2 cellCenter = (cell + 0.5) * uSize;
    vec2 localPos = fragCoord - cellCenter;

    // SQUARE SIZE. Sample noise using the cell's grid coordinates (not pixel coords) so the
    // whole square gets one consistent size, and offset by time so sizes drift frame to frame.
    float n = snoise(vec3(cell * 0.1, uTime * 0.15));
    float s = (n * 0.5 + 0.5) * uSize * 1.7;

    // INSIDE SQUARE OR GAP. Distance from the cell center using max(|x|,|y|) (Chebyshev
    // distance) gives a square footprint rather than a circle. smoothstep over a 2px band
    // anti-aliases the square's edge instead of leaving it jagged.
    float d = max(abs(localPos.x), abs(localPos.y));
    float mask = 1.0 - smoothstep(s * 0.5 - 1.0, s * 0.5 + 1.0, d);

    // Blend from the background color to solid black based on the mask: 0 outside the
    // square (pure bgColor), 1 inside it (pure black), with the smoothstep band between.
    vec3 color = mix(bgColor, vec3(0.0), mask);
    gl_FragColor = vec4(color, 1.0);
  }
`
