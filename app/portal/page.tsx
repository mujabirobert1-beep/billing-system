"use client";

import { useState } from "react";

const voucherOptions = [
  { id: "v1", label: "5000 UGX / 1 hour", amount: 5000 },
  { id: "v2", label: "10000 UGX / 2 hours", amount: 10000 },
  { id: "v3", label: "20000 UGX / 5 hours", amount: 20000 },
];

export default function CaptivePortalPage() {
  const [selectedVoucher, setSelectedVoucher] = useState(voucherOptions[0]);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    const reference = `cloudifi-${Date.now()}`;
    const response = await fetch("/api/mtn/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount: selectedVoucher.amount, reference }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus(`Error: ${result.error ?? JSON.stringify(result)}`);
      return;
    }

    setStatus(`Payment request sent. Confirm payment on your phone. Reference: ${reference}`);
  };

  return (
    <main className="container portal-page">
      <section className="portal-hero">
        <div>
          <p className="eyebrow">CloudiFi Captive Portal</p>
          <h1>Connect instantly with mobile money vouchers.</h1>
          <p className="lead">
            Purchase a hotspot voucher using MTN Mobile Money, then receive your login code by SMS.
            Use the voucher on the router login page to get online fast.
          </p>
        </div>
      </section>

      <section className="portal-card">
        <h2>Buy a voucher</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <label>
            Voucher package
            <select
              value={selectedVoucher.id}
              onChange={(event) => {
                const selected = voucherOptions.find((option) => option.id === event.target.value);
                if (selected) setSelectedVoucher(selected);
              }}
            >
              {voucherOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Mobile Money number
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="25677XXXXXXX"
              required
            />
          </label>

          <button type="submit" disabled={loading || !phone}>
            {loading ? "Requesting payment…" : "Pay with MTN"}
          </button>
        </form>

        {status && <p className="status-message">{status}</p>}

        <div className="portal-info">
          <h3>How to use the voucher</h3>
          <ul>
            <li>Choose your voucher package.</li>
            <li>Enter your MTN Mobile Money number.</li>
            <li>Confirm the request-to-pay on your phone.</li>
            <li>Receive your voucher code by SMS.</li>
            <li>Use the voucher on the hotspot login page.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
