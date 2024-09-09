import * as THREE from 'three';

const fragmentWhiteDwarfHalo = `
uniform float time;
uniform float progress;
varying vec3 vNormal;
varying vec3 eyeVector;
varying vec3 vPosition;
varying vec2 vUv;

vec3 brightness2Color(float n)
{
    // Adjusting the function to create a blue halo effect
    n *= 0.10;
    return (vec3(0.0, n * 0.3, n) * 0.08); // Blue halo based on brightness
}

void main() {

    // Calculate the intensity of the halo effect based on the normal
    float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);

    // Adjust the brightness of the halo based on the intensity
    float brightness = 1.0 + intensity * 0.83;

    // Use the brightness2Color function to get the color based on the brightness
    vec3 color = brightness2Color(brightness) * intensity;

    // Set the fragment color with a blue halo effect
    gl_FragColor = vec4(color, 1.0);  // Alpha set by radial distance
}

`;

export default fragmentWhiteDwarfHalo;