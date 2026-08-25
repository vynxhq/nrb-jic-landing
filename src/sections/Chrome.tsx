import { Reveal } from "./HowItSeals";

export function Rfq() {
  return (
    <section className="section section-alt" id="rfq">
      <div className="container rfq">
        <Reveal>
          <div className="kicker">Start small. Grow with confidence.</div>
          <h2 className="title">Request a 5–20 piece trial lot.</h2>
          <p className="lead">
            Tell us the configuration and quantity, we'll confirm price, lead time and dispatch
            date. Orders up to $35,000 are ready in 21 days, and you're updated every 10 days
            until shipment.
          </p>
          <div style={{ marginTop: 26, display: "grid", gap: 8, color: "var(--text-dim)", fontSize: "0.9rem" }}>
            <span>✉ &nbsp;noshir@nrbhydro.com · zehra@nrbhydro.com</span>
            <span>☎ &nbsp;+91 93204 30030 · +91 73037 77070</span>
            <span>
              ⚙ &nbsp;Jyot-dhir Industrial Estate, Gala 12, Bldg 4, Raj Industrial Park, Gauraipada,
              Vasai East, Palghar 401208, India
            </span>
          </div>
        </Reveal>
        <Reveal>
          <form
            className="rfq-form"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const subject = `RFQ from website: ${fd.get("company")}, ${fd.get("part")}`;
              const body = `Name: ${fd.get("name")}\nCompany: ${fd.get("company")}\nEmail: ${fd.get(
                "email",
              )}\nPart / configuration: ${fd.get("part")}\nQuantity: ${fd.get("qty")}\n\nNotes:\n${fd.get("notes")}`;
              window.location.href = `mailto:noshir@nrbhydro.com?subject=${encodeURIComponent(
                subject,
              )}&body=${encodeURIComponent(body)}`;
            }}
          >
            <input name="name" required placeholder="Your name" />
            <input name="company" placeholder="Company" />
            <input name="email" type="email" required placeholder="Email" />
            <input name="part" placeholder="Part / configuration (e.g., NUT DASH-08, SS304)" />
            <input name="qty" placeholder="Quantity (even 20 pcs is fine)" />
            <textarea name="notes" rows={4} placeholder="Notes, application, media, target date…" />
            <button className="btn btn-primary" type="submit">Send enquiry</button>
            <p className="spec-note">
              Your enquiry opens as an email to NRB directly, no data stored on this page.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <b style={{ color: "var(--text)" }}>NRB</b> Hydraulics Pvt. Ltd. · ISO 9001:2015
          certified · Vasai East, Palghar, India
        </div>
        <div>Exporting to USA &amp; Singapore · © 2026 NRB Hydraulics Pvt. Ltd.</div>
      </div>
    </footer>
  );
}

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="NRB Hydraulics home">
          <img
            src="./nrb-logo-official.png"
            alt="NRB Hydro logo"
            style={{ height: 52, width: "auto", display: "block" }}
          />
          <span className="brand-sub">Female JIC Connection System</span>
        </a>
        <nav className="nav">
          <a href="#catalog-3d">In 3D</a>
          <a href="#how-it-seals">How it seals</a>
          <a href="#precision">Manufacturing</a>
          <a href="#configurations">Configurations</a>
          <a className="cta" href="#rfq">Request sample</a>
        </nav>
      </div>
    </header>
  );
}
