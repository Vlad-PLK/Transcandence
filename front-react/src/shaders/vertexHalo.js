const vertexHalo = `
    
// Assuming you are passing the camera position as a uniform
uniform vec3 ucameraPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
    vUv = uv;

    // Compute the direction from the object to the camera
    vec3 viewDirection = normalize(cameraPosition - vec3(modelMatrix * vec4(position, 1.0)));
    
    // Adjust position based on the view direction
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Pass world position to the fragment shader
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}


`;

export default vertexHalo;
