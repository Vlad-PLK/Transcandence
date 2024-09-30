const photonSphereFragmentShader = `
precision highp float;

uniform vec3 blackHolePosition; // Position of the black hole
uniform float photonSphereRadius; // Radius of the photon sphere
uniform sampler2D utexture; // Texture for the photon sphere effect

varying vec2 vUv; // UV coordinates
varying vec3 vPosition; // World position of the fragment

void main() {
    vec3 directionToBlackHole = normalize(blackHolePosition - vPosition);
    float distanceToBlackHole = length(vPosition - blackHolePosition);

    // Compute reflection vector for shininess
    vec3 normal = normalize(vPosition - blackHolePosition);
    vec3 viewDir = normalize(-vPosition);
    vec3 reflection = reflect(viewDir, normal);
    float specular = pow(max(dot(reflection, directionToBlackHole), 0.0), 16.0); // Adjust shininess

    // Apply texture and combine with intensity and specular highlight
    vec4 photoncolor;
    color.rgb = mix(photoncolor.rgb, color, 1.1); // Orange color
    color.rgb += specular * 0.5; // Add shininess effect

    gl_FragColor = color;
}

`;

export default photonSphereFragmentShader;