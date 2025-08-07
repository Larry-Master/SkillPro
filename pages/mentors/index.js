import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MentorTable from "./_components/MentorTable";

export default function MentorsIndex() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/mentors")
      .then((res) => res.json())
      .then(setMentors)
      .catch(() => setError("Fehler beim Laden"))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (id) => router.push(`/mentors/${id}`);
  const handleDelete = async (id) => {
    if (!confirm("Wirklich löschen?")) return;
    setLoading(true);
    await fetch(`/api/mentors/${id}`, { method: "DELETE" });
    setMentors((prev) => prev.filter((m) => (m.id || m._id) !== id));
    setLoading(false);
  };

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Mentoren</h1>
      <button onClick={() => router.push("/mentors/create")}>Neu</button>
      <MentorTable mentors={mentors} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
