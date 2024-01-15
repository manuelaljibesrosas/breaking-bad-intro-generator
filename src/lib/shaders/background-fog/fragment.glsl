precision highp float;

// Noise from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
//	Simplex 3D Noise by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

varying vec2 vuv;
uniform float millis;
uniform vec2 resolution;

float speed = .5;
float scale = 1.2;
int octaves = 5;
float shift = .2;
float startAmp = .8;

float fbm (in vec3 st) {
    // Initial values
    float value = 0.0;
    float amplitude = startAmp;
    float frequency = 0.;

    // Loop of octaves
    for (int i = 0; i < octaves; i++) {
        value += amplitude * snoise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {
    // vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    vec2 uv = (vuv * 2. - 1.) * 1.;
    uv.y *= resolution.y / resolution.x;
    uv.y += 0.25;
    float time = millis / 2000. * speed;
    float plainY = uv.y * -1. + .5;

    uv *= scale;

    float mag = .2;

    float n = fbm(vec3(uv, time*.2));
    n = fbm(vec3(uv - time*.2, n * mag + time*.1));
    n = fbm(vec3(uv - time*.4, n * mag + time*.2));
    n = n*.5 + .5;
    n = pow(n, shift + plainY * (1.-shift));
    n *= 1. - plainY;
    
    vec3 baseGreen = vec3(.09, .29, .15);
    vec3 yellow = vec3(.21, .21, .0) * smoothstep(-0.25, .5, uv.x) * smoothstep(-0.25, 1., uv.y);
    vec3 green2 = baseGreen * max(0., .7 - length(uv + .18));

    vec3 color = baseGreen * .7 * n + yellow + green2 * .75;
    
    gl_FragColor = vec4(color - vuv.y * .2, 1.);
}
