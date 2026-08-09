export default function LandingPage() {
  return (
    <main className="container landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">CloudiFi Hotspot</p>
          <h1>Fast, secure Wi-Fi payment and router monitoring for ISPs.</h1>
          <p className="lead">
            CloudiFi connects mobile money payments, Mikrotik voucher issuance, and reseller monitoring into one dashboard.
            Manage sites, routers, customers, and alerts from a single interface.
          </p>
          <div className="hero-actions">
            <a href="/portal" className="hero-button">Buy voucher</a>
            <a href="/reseller" className="hero-link">Reseller dashboard</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <h2>Voucher Payment</h2>
            <p>MTN request-to-pay triggers voucher creation and SMS delivery after payment confirmation.</p>
          </div>
          <div className="hero-card hero-card-secondary">
            <h2>Router Monitoring</h2>
            <p>Heartbeat and offline detection keep resellers notified by SMS and email.</p>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <h3>Mobile Money</h3>
          <p>Support MTN MoMo sandbox and live collections for Ugandan ISPs.</p>
        </div>
        <div className="feature-card">
          <h3>Hotspot Vouchers</h3>
          <p>Auto-generate Mikrotik hotspot users and voucher credentials immediately.</p>
        </div>
        <div className="feature-card">
          <h3>Alerts & Monitoring</h3>
          <p>Send reseller SMS and email when routers go offline or need attention.</p>
        </div>
      </section>
    </main>
  );
}
