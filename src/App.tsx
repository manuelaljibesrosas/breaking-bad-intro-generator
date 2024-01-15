import { useCallback, useEffect, useRef, useState } from "react";
import { animate, easeOut } from "popmotion";
import RenderWord, {
  RenderWordImperativeHandle,
} from "@/components/renderWord";
import Background from "@/components/background";
import Controllers, { FormInputs } from "@/components/controllers";
import { ThemeProvider } from "@/components/ui/theme-provider";

function App() {
  const container = useRef<HTMLDivElement | null>(null);
  const firstWordHandle = useRef<RenderWordImperativeHandle | null>(null);
  const secondWordHandle = useRef<RenderWordImperativeHandle | null>(null);
  const [firstWord, setFirstWord] = useState("Breaking");
  const [secondWord, setSecondWord] = useState("Bad");

  const reset = useCallback(() => {
    if (firstWordHandle.current === null || secondWordHandle.current === null)
      return;

    firstWordHandle.current.reset();
    secondWordHandle.current.reset();
  }, []);

  const play = useCallback(() => {
    if (
      firstWordHandle.current === null ||
      secondWordHandle.current === null ||
      container.current === null
    )
      return;

    firstWordHandle.current.reset();
    secondWordHandle.current.reset();

    const { stop: stopZTranslateAnimation } = animate({
      from: 50,
      to: 0,
      duration: 10000,
      ease: easeOut,
      onUpdate: (y) => {
        if (container.current === null) return;

        container.current.style.transform = `translateZ(${y}px)`;
      },
    });

    let elementAnimationSubscription =
      firstWordHandle.current.playElementAnimation(() => {
        if (secondWordHandle.current === null) return;

        elementAnimationSubscription =
          secondWordHandle.current.playElementAnimation(() => {
            if (
              firstWordHandle.current === null ||
              secondWordHandle.current === null
            )
              return;

            const { stop: stopFirstWordAnimation } =
              firstWordHandle.current.playTextAnimation();
            const { stop: stopSecondWordAnimation } =
              secondWordHandle.current.playTextAnimation();

            elementAnimationSubscription = {
              stop: () => {
                stopFirstWordAnimation();
                stopSecondWordAnimation();
              },
            };
          });
      });

    return () => {
      elementAnimationSubscription.stop();
      stopZTranslateAnimation();
    };
  }, []);

  const onSubmit = useCallback(
    ({ firstWord, secondWord }: FormInputs) => {
      reset();
      setFirstWord(firstWord);
      setSecondWord(secondWord);
      setTimeout(play, 0); // wait for React to flush updates 🤷
    },
    [play, reset]
  );

  useEffect(play, [play]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="bb-ui-theme">
      <div className="perspective-3 relative w-screen h-screen flex items-center justify-center gap-1.5">
        <Background />
        <div className="fixed flex flex-col" ref={container}>
          <RenderWord ref={firstWordHandle}>{firstWord}</RenderWord>
          <RenderWord ref={secondWordHandle}>{secondWord}</RenderWord>
        </div>
        <Controllers onSubmit={onSubmit} />
      </div>
    </ThemeProvider>
  );
}

export default App;
