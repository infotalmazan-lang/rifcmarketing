import { SCORE_RANGES } from "@/lib/constants/rifc";

export default function MethodologySection() {
  return (
    <section id="methodology" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Chapter 03
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        Scoring <strong className="font-semibold">Methodology</strong>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        Each variable is evaluated on a 1&ndash;10 scale. The resulting C score
        reveals the true health of your marketing &mdash; and its financial
        impact.
      </p>

      <table className="score-table">
        <thead>
          <tr>
            <th>Score C</th>
            <th>Clarity Level</th>
            <th>Status</th>
            <th>Financial Impact</th>
          </tr>
        </thead>
        <tbody>
          {SCORE_RANGES.map((range) => (
            <tr key={range.label}>
              <td className="font-mono" style={{ color: range.statusColor }}>
                {range.min} &ndash; {range.max}
              </td>
              <td>{range.label}</td>
              <td>
                <span
                  className="font-mono inline-block text-[10px] tracking-[2px] uppercase px-3 py-1 border rounded-sm"
                  style={{
                    borderColor: `${range.statusColor}80`,
                    color: range.statusColor,
                  }}
                >
                  {range.status}
                </span>
              </td>
              <td>{range.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
