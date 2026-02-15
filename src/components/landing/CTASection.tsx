import Link from "next/link";

export default function CTASection() {
  return (
    <div className="text-center py-[120px] px-6 md:px-10 bg-gradient-to-b from-transparent via-[rgba(220,38,38,0.03)] to-transparent">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-6">
        Start Using R IF C
      </span>
      <h2 className="text-[clamp(28px,4vw,48px)] font-light mb-4 tracking-[-1px]">
        Ready to measure your <strong className="font-semibold">Clarity</strong>
        ?
      </h2>
      <p className="font-body text-base text-text-faint max-w-[500px] mx-auto mb-10 leading-[1.7]">
        Download the white paper, score your next campaign, or work directly
        with the creator.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href="/resources"
          className="inline-block font-mono text-xs tracking-[3px] uppercase px-12 py-[18px] bg-rifc-red text-surface-bg border border-rifc-red cursor-pointer transition-all duration-300 rounded-sm hover:bg-rifc-red-light"
        >
          Download White Paper
        </Link>
        <Link
          href="/consulting"
          className="inline-block font-mono text-xs tracking-[3px] uppercase px-12 py-[18px] border border-[rgba(220,38,38,0.5)] text-rifc-red bg-transparent cursor-pointer transition-all duration-300 rounded-sm hover:bg-[rgba(220,38,38,0.1)] hover:border-rifc-red"
        >
          Book Consulting
        </Link>
        <Link
          href="/calculator"
          className="inline-block font-mono text-xs tracking-[3px] uppercase px-12 py-[18px] border border-[rgba(220,38,38,0.5)] text-rifc-red bg-transparent cursor-pointer transition-all duration-300 rounded-sm hover:bg-[rgba(220,38,38,0.1)] hover:border-rifc-red"
        >
          Try Calculator
        </Link>
      </div>
    </div>
  );
}
