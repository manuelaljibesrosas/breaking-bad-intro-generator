import React, { useImperativeHandle, useMemo, useRef } from "react";
import periodicTable from "@/consts/periodic-table";
import PeriodicTableElement, {
  PeriodicTableElementImperativeHandle,
} from "@/components/periodicTableElement";
import StylizedText, {
  StylizedTextImperativeHandle,
} from "@/components/stylizedText";

export type RenderWordImperativeHandle = {
  playElementAnimation: PeriodicTableElementImperativeHandle["play"];
  playTextAnimation: StylizedTextImperativeHandle["play"];
  reset: () => void;
} | null;

const RenderWord = React.forwardRef<
  RenderWordImperativeHandle,
  { children: string }
>(function RenderWord({ children: word }, ref) {
  const elementRef = useRef<PeriodicTableElementImperativeHandle | null>(null);
  const leadingTextRef = useRef<StylizedTextImperativeHandle | null>(null);
  const textRef = useRef<StylizedTextImperativeHandle | null>(null);

  useImperativeHandle<
    RenderWordImperativeHandle,
    RenderWordImperativeHandle
  >(ref, () => ({
    playElementAnimation:
      elementRef.current?.play ||
      ((cb) => {
        cb();

        return { stop: () => undefined };
      }),
    playTextAnimation: () => {
      const leadingTextAnimationSub = leadingTextRef.current?.play();
      const trailingTextAnimationSub = textRef.current?.play();

      return {
        stop: () => {
          leadingTextAnimationSub?.stop();
          trailingTextAnimationSub?.stop();
        },
      };
    },
    reset: () => {
      elementRef.current?.reset();
      leadingTextRef.current?.reset();
      textRef.current?.reset();
    },
  }));

  const [match, matchPosition] = useMemo(
    () =>
      periodicTable.elements.reduce<
        [(typeof periodicTable.elements)[0] | null, number]
      >(
        (acc, cur) => {
          if (
            word.toLowerCase().includes(cur.symbol.toLowerCase()) &&
            (acc[0] === null || cur.symbol.length > acc[0].symbol.length)
          )
            return [cur, word.toLowerCase().indexOf(cur.symbol.toLowerCase())];

          return acc;
        },
        [null, 0]
      ),
    [word]
  );

  return (
    <div className="perspective-3 flex items-center justify-center gap-1.5">
      {word.substring(0, matchPosition).length > 0 && (
        <StylizedText
          ref={leadingTextRef}
          str={word.substring(0, matchPosition).toLowerCase()}
        />
      )}
      {match !== null && (
        <PeriodicTableElement
          key={match.symbol}
          ref={elementRef}
          element={match}
        />
      )}
      {match !== null && word.substring(matchPosition).length > 0 && (
        <StylizedText
          ref={textRef}
          str={word
            .substring(matchPosition + match.symbol.length)
            .toLowerCase()}
        />
      )}
    </div>
  );
});

export default RenderWord;
