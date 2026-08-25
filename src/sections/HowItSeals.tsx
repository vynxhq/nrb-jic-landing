import { useEffect, useRef } from "react";

/** Reveal-on-scroll wrapper (respects prefers-reduced-motion via CSS). */
export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="reveal">{children}</div>;
}

export function HowItSeals() {
  return (
    <section className="section section-alt" id="how-it-seals">
      <div className="container">
        <Reveal>
          <div className="kicker">How the connection seals</div>
          <h2 className="title">Four steps from bar stock to bubble-tight.</h2>
          <p className="lead">
            The 37° flare is why JIC works: metal-to-metal contact between the insert's flare and
            the nut's counterseat seals without O-rings, and re-seals after every reassembly.
          </p>
        </Reveal>
        <div className="steps">
          <Reveal>
            <div className="step">
              <div className="step-no">01 / FLARE</div>
              <h3>Insert flares at 37°</h3>
              <p>
                The insert's nose is machined to the SAE 37° flare angle, the sealing surface is
                the metal itself, machined from bar stock on CNC lathes.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="step">
              <div className="step-no">02 / SEAT</div>
              <h3>Nut counterseat engages</h3>
              <p>
                Torquing the nut draws its 37° counterseat against the flare. No soft seals, no
                cold flow, dependable under vibration and thermal cycles.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="step">
              <div className="step-no">03 / CRIMP</div>
              <h3>Ferrule locks the hose</h3>
              <p>
                The collar is crimped by computerized Finn-Power crimping, by calibrated pressure
                or by millimetres of movement, exactly to your specification.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="step">
              <div className="step-no">04 / PROVE</div>
              <h3>Tested before dispatch</h3>
              <p>
                Hydrostatic proof testing to 50,000 psi on a Maximator pump, nitrogen leak checks,
                and 100% thread gauging with US-imported L1/L2 gauges.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
