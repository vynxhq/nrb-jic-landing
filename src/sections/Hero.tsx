import { useEffect, useRef, useState } from "react";
import { JicAssembly } from "../three/JicAssembly";
import { StudioCanvas } from "../three/StudioCanvas";

/** Hero: full-height 3D assembly that explodes on hover, assembles on load. */
export function Hero() {
  const [explode, setExplode] = useState(0);
  const target = useRef(0);
  const [shown, setShown] = useState(0);

  // Smoothly chase the explode target so the button toggles feel fluid.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setShown((s) => {
        const d = target.current - s;
        return Math.abs(d) < 0.01 ? target.current : s + d * 0.08;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="hero" id="top">
      <div
        className="hero-canvas"
        onPointerEnter={() => (target.current = 1)}
        onPointerLeave={() => (target.current = 0)}
      >
        <StudioCanvas cameraPosition={[3.4, 1.15, 3.8]} fov={40} enableZoom={false}>
          <JicAssembly dash={8} material="ss304" explode={shown} spin />
        </StudioCanvas>
      </div>

      <div className="hero-copy">
        <span className="hero-kicker">Female JIC Connection System · 37° Flare</span>
        <h1>
          Precision fittings, <em>machined from solid bar</em>.
        </h1>
        <p className="sub">
          NRB Hydraulics manufactures JIC nuts, inserts, ferrules and steel tube ends to your
          drawings — with the tolerances, cleanliness and on-time delivery that export buyers
          audit for.
        </p>
        <div className="hero-badges">
          <span className="badge"><b>ISO 9001:2015</b> certified</span>
          <span className="badge"><b>99%</b> exported · USA &amp; Singapore</span>
          <span className="badge"><b>No</b> minimum order</span>
          <span className="badge"><b>21-day</b> OTIF up to $35,000</span>
        </div>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#configurator">Configure your fitting</a>
          <a className="btn btn-ghost" href="#rfq">Request 5–20 pc trial lot</a>
        </div>
      </div>

      <div className="hero-hint">drag to orbit · hover to explode</div>
    </section>
  );
}
