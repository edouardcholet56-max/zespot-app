"use client";

import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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

  const addAddress = () => {
    setAddresses([...addresses, ""]);
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
        setResult(data);
      }

    } catch (err) {
      setError("Erreur réseau");
    }

    setLoading(false);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "white",
      color: "black",
      fontFamily: "Helvetica, Arial, sans-serif",
      padding: 40,
      maxWidth: 600,
      margin: "0 auto"
    }}>
      
      {/* LOGO */}
      <h1 style={{
        fontSize: 40,
        marginBottom: 30,
        fontWeight: 500
      }}>
        ZeSpot
      </h1>

      {/* INPUTS */}
      <div>
        {addresses.map((addr, i) => (
          <input
            key={i}
            placeholder="Ex: 10 Rue de Turenne, 75004 Paris"
            value={addr}
            onChange={(e) => handleChange(i, e.target.value)}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 14,
              border: "1px solid #ddd",
              fontSize: 14,
              outline: "none"
            }}
          />
        ))}
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={addAddress}
        style={{
          marginTop: 5,
          background: "none",
          border: "none",
          color: "#666",
          cursor: "pointer",
          marginBottom: 20
        }}
      >
        + Ajouter une adresse
      </button>

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: 14,
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: 14
        }}
      >
        {loading ? "Recherche..." : "Rechercher"}
      </button>

      {/* ERROR */}
      {error && (
        <p style={{ marginTop: 20, color: "red" }}>
          {error}
        </p>
      )}

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: 30 }}>
          <h2 style={{ fontSize: 18 }}>{result.bar.name}</h2>
          <p style={{ color: "#666" }}>{result.bar.address}</p>
          <p style={{ marginBottom: 20 }}>⭐ {result.bar.rating}</p>

          {/* MAP */}
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={result.location}
              zoom={15}
            >
              <Marker position={result.location} />
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </main>
  );
}