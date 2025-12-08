uniform sampler2D uNoiseTexture;
uniform vec3 uColor;

varying vec2 vUv;

void main(){
    vec2 uv    = vUv;
    vec3 color = vec3(1.0);

    vec4 noiseColor = texture2D(uNoiseTexture, uv);

    float r = noiseColor.r;
          r = smoothstep(0.25, 1.0, r);

    color = vec3(r);
    color = uColor;

    vec4 finalColor = vec4(color, 1.0);
    csm_DiffuseColor = finalColor;
}