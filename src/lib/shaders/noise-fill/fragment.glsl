uniform sampler2D noiseTexture;
uniform float millis;
uniform vec2 resolution;

varying vec2 vuv;

void main() {
  vec2 uv = vuv * resolution / (2048. * .25);
  float noise = texture2D(noiseTexture, uv).r;
  float didStart = step(0.001, millis);
  gl_FragColor = vec4(smoothstep(.65, .95, (noise + millis / 1500.)) * didStart);
}
