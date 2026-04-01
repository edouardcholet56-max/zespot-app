"use client";

import { useState } from "react";

export default function Home() {
  const [addresses, setAddresses] = useState(["", "", ""]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/find-bar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addresses }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.bar);
      }
    } catch (err) {
      setError("Erreur API");
    }

    setLoading(false);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Helvetica, Arial, sans-serif"
    }}>
      
      <h1 style={{ fontSize: 48, marginBottom: 40 }}>
        ZeSpot 🍻
      </h1>

      <div style={{ width: 320 }}>
        {addresses.map((addr, i) => (
          <input
            key={i}
            placeholder={`Adresse ${i + 1}`}
            value={addr}
            onChange={(e) => handleChange(i, e.target.value)}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #333",
              background: "#111",
              color: "white"
            }}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          borderRadius: 8,
          border: "none",
          background: "white",
          color: "black",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {loading ? "Recherche..." : "Trouver le spot 🔥"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 20 }}>
          ❌ {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 30, textAlign: "center" }}>
          <h2>{result.name}</h2>
          <p>{result.address}</p>
          <p>⭐ {result.rating}</p>
        </div>
      )}
    </main>
  );
}