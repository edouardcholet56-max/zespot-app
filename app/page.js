import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Helvetica, Arial, sans-serif",
      background: "white",
      color: "black"
    }}>
      
      <h1 style={{ fontSize: 48, marginBottom: 40 }}>
        ZESPOT
      </h1>

      <Link href="/onboarding">
        <button style={{
          padding: "16px 24px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: 999,
          cursor: "pointer"
        }}>
          LET'S GET STARTED
        </button>
      </Link>

    </main>
  );
}