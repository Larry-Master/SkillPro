import { useState, useEffect } from 'react';
import styles from './CreateCourse.module.css';
import { PlusCircle } from 'lucide-react';

export default function CreateCourse({ onCourseCreated, courses = [], students = [] }) {
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
    if (!title.trim()) return alert('Title is required');
    setLoading(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, professor, capacity }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create course');
      }

      const newCourse = await res.json();
      alert('Course created!');
      onCourseCreated?.(newCourse);
      setTitle('');
      setDescription('');
      setProfessor('');
      setCapacity('');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <h2 className="sectionTitle">
      <PlusCircle size={18} /> Create New Course
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className={styles.label}>Title *</label>
          <input
            id="title"
            type="text"
            className={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
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
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="capacity" className={styles.label}>Capacity *</label>
          <input
            id="capacity"
            type="number"
            className={styles.input}
            min="0"
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="professor" className={styles.label}>Professor </label>
          <select
            id="professor"
            className={styles.input}
            value={professor}
            onChange={e => setProfessor(e.target.value)}
          >
            <option value="">Select professor</option>
            {professors.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
        </div>
  );
}
