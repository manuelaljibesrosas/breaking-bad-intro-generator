import React, { useImperativeHandle, useRef } from "react";
import { animate, easeOut, interpolate } from "popmotion";
import { Element } from "@/consts/periodic-table";

export type PeriodicTableElementImperativeHandle = {
  play: (onComplete: () => void) => ReturnType<typeof animate>;
  reset: () => void;
};

const PeriodicTableElement = React.forwardRef<
  PeriodicTableElementImperativeHandle,
  { element: Element }
>(function PeriodicTableElement(
  { element: { atomic_mass, number, symbol, shells } },
  ref
) {
  const root = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => {
    let sub: ReturnType<typeof animate> | null = null;

    return {
      play: (onComplete) =>
        (sub = animate({
          ease: easeOut,
          from: 120,
          to: 0,
          duration: 1250,
          onUpdate: (value) => {
            if (root.current === null) return;

            root.current.style.transform = `translateZ(${value}px)`;
            root.current.style.opacity = `${interpolate(
              [100, 0],
              [0, 1]
            )(value)}`;
          },
          onComplete,
        })),
      reset: () => {
        sub?.stop();

        if (root.current === null) return;

        root.current.style.transform = "translateZ(0px)";
        root.current.style.opacity = "0";
      },
    };
  });

  return (
    <div
      ref={root}
      className="select-none flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#2edbc3] via-[#29896a] to-[#031b00] opacity-0"
    >
      <div className="relative w-32 h-32 border-2 border-solid border-white rounded-sm text-xs text-white">
        <div className="absolute top-1 left-1">{atomic_mass.toFixed(2)}</div>
        <div className="absolute top-1 right-1 flex flex-col items-end">
          {shells.slice(0, 3).map((state, i) => (
            <span key={`${i}-${state}`} className="text-[10px] leading-3">
              {state}
            </span>
          ))}
        </div>
        <div className="absolute left-1 bottom-1 flex flex-col">
          <div className="font-semibold text-base leading-none">{number}</div>
          <div className="text-[11px]">{shells.slice(0, 3).join("-")}</div>
        </div>
        <div className="-translate-x-2/4 -translate-y-2/4 absolute top-2/4 left-2/4 text-7xl font-semibold font-['helvetica']">
          {symbol}
        </div>
      </div>
    </div>
  );
});

export default PeriodicTableElement;
