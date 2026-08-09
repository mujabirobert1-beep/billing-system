"use client";

import { useState } from "react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });

    const result = await response.json();
    setLoading(false);
    setStatus(result.message ?? result.error);
  };

  return (
    <main className="container">
      <h1>CloudiFi Email Signup</h1>
      <p>Enter your details and we will send a 5-digit verification code to your email.</p>

      <form onSubmit={handleSubmit} className="payment-form">
        <label>
          Full name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email address
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Phone number
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>

        <button type="submit" disabled={loading}>{loading ? "Sending code…" : "Send verification code"}</button>
      </form>

      {status && <p className="status-message">{status}</p>}
    </main>
  );
}
