import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MentorTable from '@components/MentorTable';

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

  const handleDelete = async (id) => {
    if (!confirm('Delete this mentor?')) return;
    await fetch(`/api/mentors/${id}`, { method: 'DELETE' });
    fetchMentors();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <h1>Mentors</h1>
      <button className="btn" onClick={'/mentors/create'}>New Mentor</button>
      <MentorTable mentors={mentors} onDelete={handleDelete} />
    </div>
  );
}