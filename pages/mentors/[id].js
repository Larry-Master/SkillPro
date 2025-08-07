import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MentorForm from "./_components/MentorForm";

export default function MentorDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/mentors/${id}`)
      .then((res) => res.json())
      .then(setMentor)
      .catch(() => setError("Fehler beim Laden"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/mentors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Fehler beim Aktualisieren");
      setEdit(false);
      setMentor(await res.json());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Wirklich löschen?")) return;
    setLoading(true);
    await fetch(`/api/mentors/${id}`, { method: "DELETE" });
    router.push("/mentors");
  };

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>{error}</div>;
  if (!mentor) return <div>Kein Mentor gefunden</div>;

  return (
    <div>
      <h1>Mentor: {mentor.name}</h1>
      <button onClick={() => router.push("/mentors")}>Zurück</button>
      <button onClick={handleDelete} style={{ marginLeft: 8 }}>Löschen</button>
      <button onClick={() => setEdit((e) => !e)} style={{ marginLeft: 8 }}>
        {edit ? "Abbrechen" : "Bearbeiten"}
      </button>
      {edit ? (
        <MentorForm initialData={mentor} onSubmit={handleUpdate} loading={loading} />
      ) : (
        <div>
          <p><b>Email:</b> {mentor.email}</p>
          <p><b>Branche:</b> {mentor.industry}</p>
        </div>
      )}
    </div>
  );
}
