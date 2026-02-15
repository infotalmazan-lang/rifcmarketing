export default function AuthorSection() {
  return (
    <section id="author" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        The Creator
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        Dumitru <strong className="font-semibold">Talmazan</strong>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-[60px] items-start">
        <div className="w-[120px] h-[120px] border-2 border-border-red-subtle rounded-full flex items-center justify-center text-[48px] font-light text-rifc-red">
          DT
        </div>
        <div>
          <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
            Entrepreneur, mentor, and business systems architect working at the
            intersection of digital marketing, strategy, and applied psychology.
            An advocate of structured thinking and applied stoicism, Dumitru
            created the R IF C Protocol as a reaction to the inefficiency and
            chaos of modern marketing.
          </p>
          <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
            The framework was born from a deep frustration with &ldquo;below the
            belt&rdquo; promotions, tired clich&eacute;s, and visibility
            obtained at any cost. R IF C is the answer for businesses that want
            to grow through relationship, not just transaction.
          </p>

          <div className="my-8 py-6 px-6 border-l-2 border-border-red-medium italic text-xl leading-[1.7] text-text-muted">
            &ldquo;To restore respect for the client through messages that
            deliver value before asking for money.&rdquo;
          </div>

          <div className="flex gap-3 flex-wrap">
            <span className="font-mono inline-block text-[10px] tracking-[2px] uppercase px-3 py-1 border border-[rgba(220,38,38,0.3)] text-rifc-red rounded-sm">
              Founder, CONTINUUM GRUP
            </span>
            <span className="font-mono inline-block text-[10px] tracking-[2px] uppercase px-3 py-1 border border-[rgba(37,99,235,0.3)] text-rifc-blue rounded-sm">
              Talmazan School
            </span>
            <span className="font-mono inline-block text-[10px] tracking-[2px] uppercase px-3 py-1 border border-[rgba(5,150,105,0.3)] text-rifc-green rounded-sm">
              Moldova
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
