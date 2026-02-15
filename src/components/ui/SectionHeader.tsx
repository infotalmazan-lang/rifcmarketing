"use client";

import { WatermarkNumber } from "./V2Elements";

export function SectionHeader({
  chapter,
  titlePlain,
  titleBold,
  description,
  watermarkNumber,
  watermarkColor = "#DC2626",
  className = "",
}: {
  chapter: string;
  titlePlain?: string;
  titleBold: string;
  description?: string;
  watermarkNumber?: string;
  watermarkColor?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {watermarkNumber && (
        <WatermarkNumber
          value={watermarkNumber}
          color={watermarkColor}
          size="md"
          className="-top-[40px] -right-[10px] md:-top-[60px] md:-right-[30px]"
        />
      )}
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        {chapter}
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-6">
        {titlePlain && <>{titlePlain} </>}
        <strong className="font-semibold">{titleBold}</strong>
      </h2>
      {description && (
        <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
          {description}
        </p>
      )}
    </div>
  );
}
