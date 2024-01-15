varying vec2 vuv;

void main() {
  vuv = uv;
  gl_Position = vec4(position, 1.);
}
