import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MentorTable from './_components/MentorTable';

export default function MentorListPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => { fetchMentors(); }, []);
  const fetchMentors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mentors');
      if (!res.ok) throw new Error('Failed to fetch');
      setMentors(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => router.push(`/mentors/${id}`);
  const handleDelete = async (id) => {
    if (!confirm('Wirklich löschen?')) return;
    await fetch(`/api/mentors/${id}`, { method: 'DELETE' });
    setMentors((prev) => prev.filter((m) => (m.id || m._id) !== id));
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div>
      <h1>Mentoren</h1>
      <button onClick={() => router.push('/mentors/create')}>Neu</button>
      <MentorTable mentors={mentors} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}