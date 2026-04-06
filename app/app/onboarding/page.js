"use client";

export default function Onboarding() {
  return (
    <main style={styles.container}>
      <h2 style={styles.title}>Accept geolocalisation</h2>

      <input placeholder="First name" style={styles.input} />

      <p style={styles.text}>Accept contact sharing</p>

      <a href="/create">
        <button style={styles.button}>Continue</button>
      </a>
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
    padding: 12,
    border: "1px solid #ddd",
    marginBottom: 20,
  },
  text: { color: "#666", marginBottom: 30 },
  button: {
    padding: "12px 24px",
    background: "black",
    color: "white",
    border: "none",
  },
};