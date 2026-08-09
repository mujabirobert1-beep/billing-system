"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, verificationCode }),
    });

    const result = await response.json();
    setLoading(false);
    setStatus(result.message ?? result.error);
  };

  return (
    <main className="container">
      <h1>Verify your CloudiFi email</h1>
      <p>Enter the 5-digit code sent to your email.</p>

      <form onSubmit={handleSubmit} className="payment-form">
        <label>
          Email address
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Verification code
          <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
        </label>

        <button type="submit" disabled={loading}>{loading ? "Verifying…" : "Verify email"}</button>
      </form>

      {status && <p className="status-message">{status}</p>}
    </main>
  );
}
