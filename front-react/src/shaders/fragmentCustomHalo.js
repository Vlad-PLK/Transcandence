import * as THREE from 'three';

const fragmentCustomHalo = `
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel1;
uniform vec3 color;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 eyeVector;
varying vec3 vPosition;
uniform float intensity;

float snoise(vec3 uv, float res) {
    const vec3 s = vec3(1e0, 1e2, 1e4);
    uv *= res;
    vec3 uv0 = floor(mod(uv, res)) * s;
    vec3 uv1 = floor(mod(uv + vec3(1.), res)) * s;
    vec3 f = fract(uv); 
    f = f * f * (3.0 - 2.0 * f);
    vec4 v = vec4(uv0.x + uv0.y + uv0.z, uv1.x + uv0.y + uv0.z,
                uv0.x + uv1.y + uv0.z, uv1.x + uv1.y + uv0.z);
    vec4 r = fract(sin(v * 1e-3) * 1e5);
    float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
    r = fract(sin((v + uv1.z - uv0.z) * 1e-3) * 1e5);
    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
    return mix(r0, r1, f.z) * 2.0 - 1.0;
}

void main() {
    vec2 fragCoord = vUv * iResolution;

    // Frequency data for brightness variation
    float freqs[4];
    freqs[0] = texture(iChannel1, vec2(0.01, 0.25)).x;
    freqs[1] = texture(iChannel1, vec2(0.07, 0.25)).x;
    freqs[2] = texture(iChannel1, vec2(0.15, 0.25)).x;
    freqs[3] = texture(iChannel1, vec2(0.30, 0.25)).x;

    float brightness = freqs[1] * 0.25 + freqs[2] * 0.25;
    float radius = 1.0 + brightness * 0.2;

    float time = iTime * 0.4;
    vec2 uv = fragCoord.xy / iResolution.xy;

    // Adjust for aspect ratio without squashing the corona
    float aspect = iResolution.x / iResolution.y;
    vec2 p = uv - 0.5; // Center the coordinates
    p.x *= aspect;

    // Calculate fade and distance uniformly
    float dist = length(p);
    float fade = pow(dist * 2.0, 0.7);

    float fVal1 = (0.5 + intensity / 10.0) - fade;
    float fVal2 = (0.5 + intensity / 10.0) - fade;

    float angle = atan(p.y, p.x); // Circular coordinate system
    vec3 coord = vec3(angle / 6.2832, dist, time * 0.1);

    // Smooth noise for corona effect
    float newTime1 = abs(snoise(coord + vec3(0.0, -time * (0.35 + brightness * 0.001), time * 0.015), 15.0));
    float newTime2 = abs(snoise(coord + vec3(0.0, -time * (0.15 + brightness * 0.001), time * 0.015), 45.0));

    // Multi-octave noise to create corona layers
    for (int i = 1; i <= 7; i++) {
        float power = pow(2.0, float(i + 1));
        fVal1 += (0.5 / power) * snoise(coord + vec3(0.0, -time, time * 0.2), power * (10.0) * (newTime1 + 1.0));
        fVal2 += (0.5 / power) * snoise(coord + vec3(0.0, -time, time * 0.2), power * (25.0) * (newTime2 + 1.0));
    }

    // Compute corona effect
    float corona = pow(fVal1 * max(1.1 - fade, 0.0), 2.0) * 50.0;
    corona += pow(fVal2 * max(1.1 - fade, 0.0), 2.0) * 50.0;
    corona *= 1.2 - newTime1;

    // Final color blending
    gl_FragColor = vec4(vec3(corona * color), 1.0);
}
`;

export default fragmentCustomHalo;
