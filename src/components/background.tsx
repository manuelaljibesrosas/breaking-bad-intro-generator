import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import backgroundFogVertexShader from "@/lib/shaders/background-fog/vertex.glsl";
import backgroundFogFragmentShader from "@/lib/shaders/background-fog/fragment.glsl";

function BackgroundPlane() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const uniforms = useRef({
    resolution: { value: [innerWidth, innerHeight] },
    millis: { value: 0 },
  });

  useFrame((_, delta) => {
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.millis.value +=
      delta * 1000;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={backgroundFogVertexShader}
        fragmentShader={backgroundFogFragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}

function Background() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <Canvas
        orthographic
        camera={{
          left: -1,
          right: 1,
          top: 1,
          bottom: -1,
          near: 0,
          far: 1,
          position: [0, 0, 0],
        }}
      >
        <BackgroundPlane />
      </Canvas>
    </div>
  );
}

export default Background;
