const fragmentBlackHoleShader = `
#define SURFDIST .05
#define MAXSTEPS 200
#define MAXDIST 20.
#define TAU 6.2832

#define USEDISC
#define USESTREAM

varying vec3 vWorldPosition;

uniform vec3 iResolution;           // viewport resolution (in pixels)
uniform float iTime;                 // shader playback time (in seconds)
uniform float iTimeDelta;            // render time (in seconds)
uniform float iFrameRate;            // shader frame rate
uniform int iFrame;                  // shader playback frame
uniform float iChannelTime[4];       // channel playback time (in seconds)
uniform vec3 iChannelResolution[4]; // channel resolution (in pixels)
uniform vec2 iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D iChannel0;         // input channel. XX = 2D/Cube
uniform vec4 iDate;                 // (year, month, day, time in seconds)
uniform float iSampleRate;           // sound sample rate (i.e., 44100)
uniform float customSize;
uniform float customIntensity;
uniform vec3 color;

mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

float N21(vec2 p) {
    p = fract(p * vec2(123.34, 345.35));
    p += dot(p, p + 34.53);
    return fract(p.x * p.y);
}

float Noise(vec2 p) {
    vec2 gv = fract(p);
    vec2 id = floor(p);
    gv = smoothstep(0., 1., gv);
    float b = mix(N21(id + vec2(0, 0)), N21(id + vec2(1, 0)), gv.x);
    float t = mix(N21(id + vec2(0, 1)), N21(id + vec2(1, 1)), gv.x);
    return mix(b, t, gv.y);
}

float Noise3(vec2 p) {
    return (Noise(p) + 
        .50 * Noise(p * 2.12 * Rot(1.)) +
        .25 * Noise(p * 4.54 * Rot(2.))) / 1.75;
}

vec3 GetRd(vec2 uv, vec3 ro, vec3 lookat, vec3 up, float zoom, inout vec3 bBend) {
    vec3 f = normalize(lookat - ro),
         r = normalize(cross(up, f)),
         u = cross(f, r),
         c = ro + zoom * f,
         i = c + uv.x * r + uv.y * u,
         rd = normalize(i - ro);
    vec3 offs = normalize(uv.x * r + uv.y * u);
    bBend = rd - (.15 * customSize) * offs / (1. + dot(uv, uv));
    return rd;   
}

vec3 GetBg(vec3 rd) {
    float x = atan(rd.x, rd.z);
    float y = dot(rd, vec3(0, 1, 0));
    float size = 10.;
    vec2 uv = vec2(x, y) * size;
    float m = abs(y);
    float side = Noise3(uv);
    float stars = pow(Noise(uv * 20.) * Noise(uv * 23.), 10.);
    vec2 puv = rd.xz * size;
    float poles = Noise3(rd.xz * size);
    float stars2 = pow(Noise(puv * 21.) * Noise(puv * 13.), 10.);
    stars = mix(stars, stars2, m * m);
    float n = mix(side, poles, m * m);
    n = pow(n, 5.);
    vec3 nebulae = n * vec3(1., .7, .5);
    return nebulae + stars * 4.;
}

float GetDist(vec3 p) {
    float d = length(p) - (0.35 * customSize);
    return d;
}

float GetDisc(vec3 p, vec3 pp) {
    float t = iTime;
    vec3 rd = p - pp;
    vec3 c = pp + rd * pp.y;
    rd = normalize(rd) * .1;
    p = c - rd;
    rd *= 2.;
    float m = 0.;
    const float numSamples = 5.;
    for(float i = 0.; i < 1.; i += 1. / numSamples) {
        c = p + i * rd;
        float d = length(c.xz);
        float l = smoothstep(2. * customSize, .6, d);
        l *= smoothstep(.1, .6, d);
        float x = atan(c.x, c.z);
        l *= sin(x * floor(5.) + d * 20. - t) * .3 + .7;
        m += l;
    }   
    return (1.5 * customIntensity) * m / numSamples;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * iResolution.xy) / iResolution.y;
    vec2 m = iMouse.xy / iResolution.xy;
    vec3 col = vec3(0);
    vec3 ro = vec3(3.0, 0, -4.5 + sin(iTime * .001));
    ro.yz *= Rot(m.y * TAU + 18.5 * .01);
    ro.xz *= Rot(-m.x * TAU + iTime * .02);
    vec3 lookat = vec3(0);
    float zoom = .2;
    vec3 up = normalize(vec3(.5, 1, 0.2));
    vec3 bBend;
    vec3 rd = GetRd(uv, ro, lookat, up, zoom, bBend);
    float dS, dO;
    float disc = 0.;
    vec3 p = ro;
    p += N21(uv) * rd * .05;
    vec3 pp;
    float stream = 0.;
    for(int i = 0; i < MAXSTEPS; i++) {
        rd -= .01 * p / dot(p, p);
        pp = p;
        p += dS * rd;
        if(p.y * pp.y < 0.)
            disc += GetDisc(p, pp);
        float y = abs(p.y) * .2;
        stream += smoothstep(.1 + y, 0., length(p.xz)) *
            smoothstep(0., .2, y) *
            smoothstep(1., .5, y) * .05;
        dS = GetDist(p);
        dS = min(.05, dS);
        dO += dS;
        if(dS < SURFDIST || dO > MAXDIST) 
            break;
    }
    col = GetBg(bBend);
    if(dS < SURFDIST)
        col = vec3(0); // it's black!
    #ifdef USEDISC
    col += disc * color;
    #endif
    #ifdef USESTREAM
    col += min(.5, stream) * color;
    #endif
    
    gl_FragColor = vec4(col, 1.0);
}
`;

export default fragmentBlackHoleShader;





// // Fragment Shader
// #define iterations 12
// #define formuparam 0.57
// #define volsteps 10
// #define stepsize 0.2
// #define zoom 1.200
// #define tile 1.0
// #define speed 0.010
// #define brightness 0.0015
// #define darkmatter 1.00
// #define distfading 0.730
// #define saturation 1.0

// uniform vec2 iResolution;
// uniform vec3 ucameraPosition;
// uniform vec3 cameraDirection;
// uniform vec3 blackholeCenter;
// uniform float blackholeRadius;
// uniform float blackholeIntensity;
// uniform float iTime;
// uniform sampler2D backgroundTexture;

// varying vec3 vWorldPosition;
// varying vec3 vUv;

// // Sphere intersection
// float iSphere(vec3 ray, vec3 dir, vec3 center, float radius) {
//     vec3 rc = ray - center;
//     float c = dot(rc, rc) - (radius * radius);
//     float b = dot(dir, rc);
//     float d = b * b - c;
//     float t = -b - sqrt(abs(d));
//     float st = step(0.0, min(t, d));
//     return mix(-1.0, t, st);
// }

// // Plane intersection
// vec3 iPlane(vec3 ro, vec3 rd, vec3 po, vec3 pd) {
//     float d = dot(po - ro, pd) / dot(rd, pd);
//     return d * rd + ro;
// }

// // Rotation helper
// vec3 r(vec3 v, vec2 r) {
//     vec4 t = sin(vec4(r, r + 1.5707963268));
//     float g = dot(v.yz, t.yw);
//     return vec3(v.x * t.z - g * t.x,
//                 v.y * t.w - v.z * t.y,
//                 v.x * t.x + g * t.z);
// }

// void mainImage(out vec4 fragColor, in vec2 fragCoord) {
//     // Screen coordinates and direction
//     vec2 uv = fragCoord.xy / iResolution.xy - 0.5;
//     uv.y *= iResolution.y / iResolution.x;
//     vec3 dir = normalize(vec3(uv * zoom, 1.0));
//     vec3 backgroundColor = texture2D(backgroundTexture, uv).rgb;
    
//     // Camera time-based movement (optional)
//     float time = iTime * speed + 0.25;

//     // Start from camera position
//     vec3 from = ucameraPosition;
    
//     // Calculate black hole interactions
//     vec3 nml = normalize(blackholeCenter - from);
//     vec3 pos = iPlane(from, dir, blackholeCenter, nml);
//     pos = blackholeCenter - pos;
//     float intensity = dot(pos, pos);
    
//         intensity = 1.0 / intensity;
//         dir = mix(dir, pos * sqrt(intensity), blackholeIntensity * intensity);
        
//         // Volumetric rendering
//         float s = 0.1, fade = 1.0;
//         vec3 v = vec3(0.0);
//         for (int r = 0; r < volsteps; r++) {
//             vec3 p = from + s * dir * 0.5;
//             p = abs(vec3(tile) - mod(p, vec3(tile * 2.0)));  // Tiling fold
//             float pa = 0.0, a = 0.0;
//             for (int i = 0; i < iterations; i++) {
//                 p = abs(p) / dot(p, p) - formuparam;
//                 a += abs(length(p) - pa);
//                 pa = length(p);
//             }
//             float dm = max(0.0, darkmatter - a * a * 0.001);  // Dark matter
//             a *= a * a;
//             if (r > 6) fade *= 1.0 - dm;
//             v += fade;
//             v += vec3(s, s * s, s * s * s * s) * a * brightness * fade;
//             fade *= distfading;
//             s += stepsize;
//         }
        
//         // Color adjustment
//         v = mix(vec3(length(v)), v, saturation);
//         fragColor = vec4(v * 0.04, 1.0);
// }

// void main() {
//     mainImage(gl_FragColor, gl_FragCoord.xy);
// }