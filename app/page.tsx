"use client";

import { useState } from "react";

const voucherOptions = [
  { id: "v1", label: "5000 UGX / 1 hour", amount: 5000 },
  { id: "v2", label: "10000 UGX / 2 hours", amount: 10000 },
  { id: "v3", label: "20000 UGX / 5 hours", amount: 20000 },
];

export default function Home() {
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

    setStatus(`MTN request-to-pay created. Complete payment on your phone. Reference: ${reference}`);
  };

  return (
    <main className="container">
      <h1>CloudiFi Hotspot Payment</h1>
      <p>Select a voucher package, enter your Mobile Money number, and pay. The voucher code will be sent by SMS after payment confirmation.</p>

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

      <section>
        <h2>How it works</h2>
        <ol>
          <li>Select a voucher.</li>
          <li>Enter your MoMo number.</li>
          <li>CloudiFi calls MTN request-to-pay.</li>
          <li>You confirm payment on your phone.</li>
          <li>CloudiFi receives the callback and creates the voucher.</li>
          <li>The voucher code is sent by SMS.</li>
        </ol>
      </section>
    </main>
  );
}
