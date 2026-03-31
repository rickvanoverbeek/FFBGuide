import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="peer w-full cursor-pointer appearance-none bg-transparent focus:outline-none"
        style={
          {
            "--slider-progress": `${percentage}%`,
          } as React.CSSProperties
        }
      />
      {/* Track styling via a pseudo-element overlay */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-muted"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <style>{`
        /* Reset default range styling */
        input[type="range"]::-webkit-slider-runnable-track {
          height: 0.5rem;
          background: transparent;
          border-radius: 9999px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 1.125rem;
          width: 1.125rem;
          border-radius: 9999px;
          background: var(--primary);
          border: 2px solid var(--background);
          box-shadow: 0 1px 3px rgba(0,0,0,.2);
          margin-top: -0.3125rem;
          position: relative;
          z-index: 1;
        }
        input[type="range"]::-moz-range-track {
          height: 0.5rem;
          background: transparent;
          border-radius: 9999px;
        }
        input[type="range"]::-moz-range-thumb {
          height: 1.125rem;
          width: 1.125rem;
          border-radius: 9999px;
          background: var(--primary);
          border: 2px solid var(--background);
          box-shadow: 0 1px 3px rgba(0,0,0,.2);
        }
        input[type="range"]:focus-visible::-webkit-slider-thumb {
          outline: 2px solid var(--ring);
          outline-offset: 2px;
        }
        input[type="range"]:focus-visible::-moz-range-thumb {
          outline: 2px solid var(--ring);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

export { Slider };
