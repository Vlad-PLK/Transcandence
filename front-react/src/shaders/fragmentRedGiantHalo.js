const fragmentRedGiantHalo = `
uniform float time;
uniform float progress;
varying vec3 vNormal;
varying vec3 eyeVector;
varying vec3 vPosition;
varying vec2 vUv;

    vec3 brightness2Color(float n)
{
    n *= 0.10;
    return (vec3(n, n * n *n *n, 0.0) / 0.25) * 1.0;
}

void main() {

    float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 0.5)), 2.5);

    // Adjust the brightness based on the radial distance
    float brightness = 1.0 + intensity * 0.83;

    // Use the brightness2Color function to get the color based on the brightness
    vec3 color = brightness2Color(brightness) * intensity;

    // Set the fragment color, where alpha is proportional to the distance
    gl_FragColor = vec4(color, 1.0);  // Alpha set by radial distance
}

`;

export default fragmentRedGiantHalo;