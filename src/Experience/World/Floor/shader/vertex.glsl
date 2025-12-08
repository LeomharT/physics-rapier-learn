uniform sampler2D uNoiseTexture;

varying vec2 vUv;

void main() {
    
    vec4 noiseColor = texture2D(uNoiseTexture, uv);

    float terrainOffset = noiseColor.r;
          terrainOffset = smoothstep(0.125, 1.0, terrainOffset);

    csm_Position.z += terrainOffset * 2.0;

    // Varying
    vUv = uv;
}