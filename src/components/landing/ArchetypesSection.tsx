import { Ghost, Theater, Gem } from "lucide-react";
import { ARCHETYPES } from "@/lib/constants/rifc";

const ICON_MAP: Record<string, React.ReactNode> = {
  ghost: <Ghost size={48} />,
  theater: <Theater size={48} />,
  gem: <Gem size={48} />,
};

export default function ArchetypesSection() {
  return (
    <section id="archetypes" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Chapter 05
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        Failure <strong className="font-semibold">Archetypes</strong>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        Every marketing failure falls into one of three patterns. Learn to
        diagnose them instantly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {ARCHETYPES.map((a) => (
          <div
            key={a.name}
            className="bg-surface-card border border-border-light rounded-sm p-9 transition-all duration-400 hover:border-border-red-subtle hover:bg-surface-card-hover hover:-translate-y-0.5"
            style={{ borderColor: `${a.color}20` }}
          >
            <div className="mb-4" style={{ color: a.color }}>
              {ICON_MAP[a.icon] || <Ghost size={48} />}
            </div>
            <div
              className="font-mono text-sm font-semibold tracking-[1px] mb-3"
              style={{ color: a.color }}
            >
              {a.name}
            </div>
            <div
              className="font-mono text-xs opacity-70 mb-3"
              style={{ color: a.color }}
            >
              {a.formula}
            </div>
            <div className="font-body text-sm leading-[1.7] text-text-muted">
              {a.description}
            </div>
            <div className="mt-4 font-mono text-[11px] text-text-ghost tracking-[1px]">
              {a.score}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
