// pages/mentors/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MentorForm from '@/components/mentors/MentorForm';

export default function MentorDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/mentors/${id}`);
        if (!res.ok) throw new Error('Nicht gefunden');
        setMentor(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      const res = await fetch(`/api/mentors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Fehler beim Aktualisieren');
      setEditing(false);
      setMentor(await res.json());
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Wirklich löschen?')) return;
    await fetch(`/api/mentors/${id}`, { method: 'DELETE' });
    router.push('/mentors');
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div className="container">
      <h1>Mentor Details</h1>
      {editing ? (
        <MentorForm initialData={mentor} onSubmit={handleUpdate} />
      ) : (
        <div>
          <p><strong>Name:</strong> {mentor.name}</p>
          <p><strong>Email:</strong> {mentor.email}</p>
          <p><strong>Branche:</strong> {mentor.industry}</p>
          <button onClick={() => setEditing(true)}>Bearbeiten</button>
          <button onClick={handleDelete}>Löschen</button>
        </div>
      )}
    </div>
  );
}