import prisma from "../../lib/prisma";

function formatRelativeTime(date: Date | null) {
  if (!date) return "Never";
  const diff = Math.round((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const minutes = Math.round(diff / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const next = bytes / 1024;
  if (next < 1024) return `${next.toFixed(1)} KB`;
  const mb = next / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

async function getResellerData() {
  const reseller = await prisma.reseller.findFirst({
    include: {
      sites: {
        include: {
          routers: true,
        },
      },
    },
  });

  const onlineCustomers = await prisma.dataUsage.groupBy({
    by: ["customerId"],
    where: { online: true },
    _count: { _all: true },
  });

  const latestOnlineSessions = await prisma.dataUsage.findMany({
    where: { online: true },
    include: { customer: true, router: true },
    orderBy: { sessionStart: "desc" },
    take: 2,
  });

  const recentPayments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { customer: true },
  });

  return {
    reseller,
    onlineCustomerCount: onlineCustomers.length,
    latestOnlineSessions,
    recentPayments,
  };
}

export default async function ResellerDashboard() {
  const { reseller, onlineCustomerCount, latestOnlineSessions, recentPayments } = await getResellerData();

  if (!reseller) {
    return (
      <main className="container">
        <h1>Reseller Dashboard</h1>
        <p>No reseller configured yet.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="dashboard-header">
        <h1>{reseller.name}</h1>
        <p>Reseller status summary for all CloudiFi sites and routers.</p>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <h2>Customers Online</h2>
          <p className="summary-value">{onlineCustomerCount}</p>
        </div>
        <div className="summary-card">
          <h2>Recent payment</h2>
          <p>{recentPayments[0]?.customer?.name ?? "—"}</p>
          <p>{recentPayments[0] ? `${recentPayments[0].amount} UGX - Voucher: ${recentPayments[0].reference}` : "No recent payments"}</p>
        </div>
      </section>

      <section className="customer-section">
        <div className="section-header">
          <h2>Customers Online</h2>
          <p>{onlineCustomerCount} active customers now</p>
        </div>

        <div className="customer-grid">
          {latestOnlineSessions.map((usage) => (
            <div key={usage.id} className="customer-card">
              <div className="customer-card-header">
                <div>
                  <h3>{usage.customer?.name ?? "Unknown"}</h3>
                  <p>{usage.customer?.phone}</p>
                </div>
                <span className="status-pill online">ONLINE</span>
              </div>
              <p>{formatBytes(usage.bytesUp + usage.bytesDown)} used</p>
              <p>Router: {usage.router?.name ?? "Unknown"}</p>
            </div>
          ))}
        </div>
      </section>

      {reseller.sites.map((site) => {
        const onlineRouters = site.routers.filter((router) => router.status === "online").length;
        const offlineRouters = site.routers.filter((router) => router.status !== "online").length;

        return (
          <section key={site.id} className="site-card">
            <div className="site-header">
              <div>
                <h2>{site.name}</h2>
                <p>{site.location ?? ""}</p>
              </div>
              <div className="site-status">
                <span>{onlineRouters} Online</span>
                <span>{offlineRouters} Offline</span>
              </div>
            </div>

            <div className="router-grid">
              {site.routers.map((router) => (
                <div key={router.id} className={`router-card ${router.status}`}>
                  <div className="router-top">
                    <div>
                      <h3>{router.name}</h3>
                      <p className="router-meta">{router.identity}</p>
                    </div>
                    <span className="status-pill">{router.status.toUpperCase()}</span>
                  </div>

                  <div className="router-details">
                    <p><strong>IP:</strong> {router.ip ?? "N/A"}</p>
                    <p><strong>CPU:</strong> {router.cpu != null ? `${router.cpu}%` : "N/A"}</p>
                    <p><strong>RAM:</strong> {router.ram != null ? `${router.ram}%` : "N/A"}</p>
                    <p><strong>Last seen:</strong> {formatRelativeTime(router.lastSeen ? new Date(router.lastSeen) : null)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
