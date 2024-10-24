import * as THREE from 'three'

const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
        opacity: { value: 1.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float iTime;
        uniform vec3 iResolution;
        uniform float opacity;

        #define UVScale 0.4
        #define Speed 0.6
        #define FBM_WarpPrimary		-0.24
        #define FBM_WarpSecond		 0.29
        #define FBM_WarpPersist 	 0.78
        #define FBM_EvalPersist 	 0.62
        #define FBM_Persistence 	 0.5
        #define FBM_Lacunarity 		 2.2
        #define FBM_Octaves 		 5

        vec4 hash43(vec3 p)
        {
            vec4 p4 = fract(vec4(p.xyzx) * vec4(1031, .1030, .0973, .1099));
            p4 += dot(p4, p4.wzxy+19.19);
            return -1.0 + 2.0 * fract(vec4(
                (p4.x + p4.y)*p4.z, (p4.x + p4.z)*p4.y,
                (p4.y + p4.z)*p4.w, (p4.z + p4.w)*p4.x)
            );
        }

        //offsets for noise
        const vec3 nbs[] = vec3[8] (
            vec3(0.0, 0.0, 0.0),vec3(0.0, 1.0, 0.0),vec3(1.0, 0.0, 0.0),vec3(1.0, 1.0, 0.0),
            vec3(0.0, 0.0, 1.0),vec3(0.0, 1.0, 1.0),vec3(1.0, 0.0, 1.0),vec3(1.0, 1.0, 1.0)
        );

        //'Simplex out of value noise', forked from: https://www.shadertoy.com/view/XltXRH
        //not sure about performance, is this faster than classic simplex noise?
        vec4 AchNoise3D(vec3 x)
        {
            vec3 p = floor(x);
            vec3 fr = smoothstep(0.0, 1.0, fract(x));

            vec4 L1C1 = mix(hash43(p+nbs[0]), hash43(p+nbs[2]), fr.x);
            vec4 L1C2 = mix(hash43(p+nbs[1]), hash43(p+nbs[3]), fr.x);
            vec4 L1C3 = mix(hash43(p+nbs[4]), hash43(p+nbs[6]), fr.x);
            vec4 L1C4 = mix(hash43(p+nbs[5]), hash43(p+nbs[7]), fr.x);
            vec4 L2C1 = mix(L1C1, L1C2, fr.y);
            vec4 L2C2 = mix(L1C3, L1C4, fr.y);
            return mix(L2C1, L2C2, fr.z);
        }

        vec4 ValueSimplex3D(vec3 p)
        {
            vec4 a = AchNoise3D(p);
            vec4 b = AchNoise3D(p + 120.5);
            return (a + b) * 0.5;
        }

        //my FBM
        vec4 FBM(vec3 p)
        {
            vec4 f, s, n = vec4(0.0);
            float a = 1.0, w = 0.0;
            for (int i=0; i<FBM_Octaves; i++)
            {
                n = ValueSimplex3D(p);
                f += (abs(n)) * a;	//billowed-like
                s += n.zwxy *a;
                a *= FBM_Persistence;
                w *= FBM_WarpPersist;
                p *= FBM_Lacunarity;
                p += n.xyz * FBM_WarpPrimary *w;
                p += s.xyz * FBM_WarpSecond;
                p.z *= FBM_EvalPersist +(f.w *0.5+0.5) *0.015;
            }
            return f;
        }

        void mainImage(out vec4 col, in vec2 uv) {
            float aspect = iResolution.x / iResolution.y;
            uv /= iResolution.xy / UVScale * 0.1; 
            uv.x *= aspect;

            col = vec4(0.0, 0.0, 0.0, 1.0);
            vec4 fbm = (FBM(vec3(uv, iTime * Speed + 100.0)));
            float explosionGrad = (dot(fbm.xyzw, fbm.yxwx)) * .5;
            explosionGrad = pow(explosionGrad, 1.3);
            explosionGrad = smoothstep(0.0, 1.0, explosionGrad);
            
            #define color0 vec3(1.2, 0.0, 0.0)
            #define color1 vec3(0.9, 0.7, 0.3)
            
            col.xyz = explosionGrad * mix(color0, color1, explosionGrad) * (2. - opacity) + 0.05;
            col.a *= (opacity);
        }

        void main() {
            mainImage(gl_FragColor, gl_FragCoord.xy);
        }
    `,
    transparent: true,
    side: THREE.DoubleSide,
});

function alterPlaneGeometry(planeGeometry, center, radius) {
    const positionAttribute = planeGeometry.attributes.position;
    const vertices = positionAttribute.array;
    const vertexCount = vertices.length / 3;

    for (let i = 0; i < vertexCount; i++) {
        const x = vertices[i * 3];
        const y = vertices[i * 3 + 1];
        const z = vertices[i * 3 + 2];

        const distance = Math.sqrt((x - center.x) ** 2 + (z - center.z) ** 2);
        if (distance < radius) {
            vertices[i * 3 + 1] = -10;
        }
    }

    positionAttribute.needsUpdate = true;
    planeGeometry.computeVertexNormals();
}

function shockWave(scene, contactPoint, planeGeometry) {
    const geometry = new THREE.SphereGeometry(4, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        depthTest: true,
        transparent: true,
        opacity: 0.5
    });

    const shockwave = new THREE.Mesh(geometry, material);
    shockwave.position.copy(contactPoint);
    // scene.add(shockwave);

    // Create and add the shader sphere
    const shaderSphere = new THREE.Mesh(geometry, shaderMaterial);
    shaderSphere.position.copy(contactPoint);
    shaderSphere.scale.setScalar(1);
    scene.add(shaderSphere);

    animateShockwave(shockwave, scene, planeGeometry, contactPoint, shaderSphere);
}

function animateShockwave(shockwave, scene, planeGeometry, contactPoint, shaderSphere) {
    const initialScale = 0.2;
    const targetScale = 15;

    const animationDuration = 4000; 
    const startTime = Date.now();

    function animateWave() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        const currentScale = initialScale + (targetScale - initialScale) * progress;
        shockwave.scale.set(currentScale, currentScale, currentScale);
        shaderSphere.scale.set(currentScale, currentScale, currentScale); // Scale the shader sphere

        // Reduce opacity as it expands
        
        shaderMaterial.uniforms.iTime.value = progress * animationDuration * 0.001;
        shaderMaterial.uniforms.opacity.value = 1 - progress;

        // Modify the plane geometry based on shockwave's expansion
        alterPlaneGeometry(planeGeometry, contactPoint, currentScale * shockwave.geometry.parameters.radius);

        if (progress < 1) {
            requestAnimationFrame(animateWave);
        } else {
            scene.remove(shockwave);
            scene.remove(shaderSphere); // Remove shader sphere after animation completes
        }
    }
    animateWave();
}

export default shockWave;
