"use client";

import { useState } from "react";

export default function Create() {
  const [addresses, setAddresses] = useState(["", "", ""]);

  const handleChange = (i, value) => {
    const copy = [...addresses];
    copy[i] = value;
    setAddresses(copy);
  };

  const addAddress = () => {
    setAddresses([...addresses, ""]);
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/find-bar", {
      method: "POST",
      body: JSON.stringify({ addresses }),
    });

    const data = await res.json();

    window.location.href = `/result?name=${encodeURIComponent(
      data.bar.name
    )}&address=${encodeURIComponent(data.bar.address)}`;
  };

  return (
    <main style={styles.container}>
      <h2 style={styles.title}>Register your address</h2>

      {addresses.map((addr, i) => (
        <input
          key={i}
          placeholder="12 rue du Championnat, 75004 Paris"
          value={addr}
          onChange={(e) => handleChange(i, e.target.value)}
          style={styles.input}
        />
      ))}

      <button onClick={addAddress} style={styles.link}>
        + Add address
      </button>

      <button onClick={handleSubmit} style={styles.button}>
        FIND THE SPOT
      </button>
    </main>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica",
    background: "white",
  },
  title: { marginBottom: 20 },
  input: {
    width: 280,
    padding: 14,
    marginBottom: 10,
    borderRadius: 20,
    border: "none",
    background: "#eee",
  },
  link: {
    background: "none",
    border: "none",
    marginBottom: 20,
    color: "#666",
    cursor: "pointer",
  },
  button: {
    padding: "14px 24px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: 30,
  },
};