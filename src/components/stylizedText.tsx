import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { animate } from "popmotion";
import noiseTexture from "@/assets/textures/noise.png";
import noiseFillVertexShader from "@/lib/shaders/background-fog/vertex.glsl";
import noiseFillFragmentShader from "@/lib/shaders/noise-fill/fragment.glsl";
import heartBreakingBadFont from "@/assets/fonts/heart-breaking-bad.otf";

const fontSize = 128;
const texture = new THREE.TextureLoader().load(noiseTexture);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

export type StylizedTextImperativeHandle = {
  play: () => { stop: () => void };
  reset: () => void;
};

const NoiseFillPlane = React.forwardRef<StylizedTextImperativeHandle>(
  function NoiseFillPlane(_, ref) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const uniforms = useRef({
      resolution: { value: [256, 128] },
      noiseTexture: {
        value: texture,
      },
      millis: { value: 0 },
    });
    const {
      size: { width, height },
    } = useThree();

    useImperativeHandle(
      ref,
      () => {
        let sub: ReturnType<typeof animate> | null = null;

        return {
          play: () => {
            sub = animate({
              from: 0,
              to: 1,
              duration: 1200,
              onUpdate: (y) => {
                (
                  meshRef.current.material as THREE.ShaderMaterial
                ).uniforms.resolution.value = [width, height];
                (
                  meshRef.current.material as THREE.ShaderMaterial
                ).uniforms.millis.value = y * 1000;
              },
            });

            return sub;
          },
          reset: () => {
            if (sub !== null) sub.stop();

            (
              meshRef.current.material as THREE.ShaderMaterial
            ).uniforms.millis.value = 0;
          },
        };
      },
      [height, width]
    );

    return (
      <mesh ref={meshRef}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={noiseFillVertexShader}
          fragmentShader={noiseFillFragmentShader}
          uniforms={uniforms.current}
        />
      </mesh>
    );
  }
);

const StylizedText = React.forwardRef<
  StylizedTextImperativeHandle,
  { str: string }
>(function StylizedText({ str }, ref) {
  const root = useRef<HTMLDivElement | null>(null);
  const _txt = useRef<HTMLDivElement | null>(null);
  const noiseFillRef = useRef<StylizedTextImperativeHandle>(null!);

  useImperativeHandle(ref, () => ({
    play: () => noiseFillRef.current?.play(),
    reset: () => noiseFillRef.current?.reset(),
  }));

  const generateMaskImage = useCallback(async () => {
    if (_txt.current === null) return;

    if (!document.fonts.check(`400 ${fontSize}px/1 "Heart Breaking Bad"`)) {
      const font = new FontFace(
        "Heart Breaking Bad",
        `url(${heartBreakingBadFont})`
      );
      const loadedFont = await font.load();

      document.fonts.add(loadedFont);
    }

    const canvas = document.createElement("canvas");
    canvas.width = _txt.current.clientWidth;
    canvas.height = fontSize;

    const ctx = canvas.getContext("2d")!;
    ctx.font = `400 ${fontSize}px/1 "Heart Breaking Bad"`;
    ctx.fillText(str, 0, 108);

    return canvas.toDataURL("image/png");
  }, [str]);

  useEffect(() => {
    const updateMask = async () => {
      if (root.current === null || _txt.current === null) return;

      const img = await generateMaskImage();

      Object.assign(root.current.style, {
        width: `${_txt.current.clientWidth}px`,
        "-webkit-mask-image": `url(${img})`,
        "mask-image": `url(${img})`,
      });
    };

    updateMask();
  }, [generateMaskImage]);

  return (
    <div ref={root} className="relative h-[128px]">
      <div
        ref={_txt}
        className="absolute opacity-0 leading-none text-[128px] font-['Heart_Breaking_Bad']"
      >
        {str.toLowerCase()}
      </div>
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
        <NoiseFillPlane ref={noiseFillRef} />
      </Canvas>
    </div>
  );
});

export default StylizedText;
