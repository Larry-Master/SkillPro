import { useState } from "react";
import { useRouter } from "next/router";
import MentorForm from "./_components/MentorForm";

export default function MentorCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Fehler beim Anlegen");
      router.push("/mentors");
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Mentor anlegen</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <MentorForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}

