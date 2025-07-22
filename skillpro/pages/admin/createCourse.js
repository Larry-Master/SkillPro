import { useState } from 'react';
import styles from './CreateCourse.module.css';

export default function CreateCourse({ onCourseCreated }) {

  const [professors, setProfessors] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [professor, setProfessor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  async function fetchProfessors() {
    try {
      const res = await fetch('/api/professors');
      const data = await res.json();
      setProfessors(data);
    } catch (err) {
      console.error('Failed to load professors:', err);
    }
  }

  fetchProfessors();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert('Course title is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, professor, capacity }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create course');
      }

      const newCourse = await res.json();
      alert('Course created successfully!');
      setTitle('');
      setDescription('');

      if (onCourseCreated) onCourseCreated(newCourse); // callback to refresh list

    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
  <h2 className={styles.title}>Create New Course</h2>

  <div>
    <label htmlFor="title" className={styles.label}>Title *</label>
    <input
      id="title"
      type="text"
      className={styles.input}
      value={title}
      onChange={e => setTitle(e.target.value)}
      disabled={loading}
      required
    />
  </div>

  <div>
    <label htmlFor="description" className={styles.label}>Description</label>
    <textarea
      id="description"
      className={styles.textarea}
      value={description}
      onChange={e => setDescription(e.target.value)}
      disabled={loading}
      rows={3}
    />
  </div>

  <div>
  <label htmlFor="capacity" className={styles.label}>Capacity *</label>
  <input
    id="capacity"
    type="number"
    min={0}
    className={styles.input}
    value={capacity}
    onChange={e => setCapacity(Number(e.target.value))}
    required
  />
</div>

<div>
  <label htmlFor="professor">Professor *</label>
  <select
    id="professor"
    className={styles.select}
    value={professor}
    onChange={e => setProfessor(e.target.value)}
    required
  >
    <option value="">Select a professor</option>
    {professors.map(p => (
      <option key={p._id} value={p._id}>
        {p.name}
      </option>
    ))}
  </select>
</div>

  <button type="submit" className={styles.button} disabled={loading}>
    {loading ? 'Creating...' : 'Create Course'}
  </button>
</form>
  );
}
