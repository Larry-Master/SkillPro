import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './AdminDashboard.module.css';

import {
  Users,
  BookOpen,
  PlusCircle,
  Loader2,
  Trash2,
} from 'lucide-react'; // modern icons

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/courses'),
        ]);
        const [studentsData, coursesData] = await Promise.all([
          studentsRes.json(),
          coursesRes.json(),
        ]);
        setStudents(studentsData);
        setCourses(coursesData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleDeleteStudent(id) {
    if (!confirm('Delete this student?')) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting student');
    }
  }

  async function handleDeleteCourse(id) {
    if (!confirm('Delete this course?')) return;
    try {
      console.log('Deleting course:', `/api/courses/${id}`);
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting course');
    }
  }

  async function handleEnroll() {
    if (!selectedStudent || !selectedCourse) {
      alert('Select both student and course');
      return;
    }

    setEnrollLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: selectedStudent, courseId: selectedCourse }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to enroll');
      alert('Enrollment successful!');
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setEnrollLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>
          <Users size={24} style={{ marginRight: '8px' }} />
          Admin Dashboard
        </h1>

        {loading ? (
          <p>
            <Loader2 className="animate-spin" /> Loading...
          </p>
        ) : (
          <div className={styles.sectionsWrapper}>
            {/* Students */}
            <section className={styles.section}>
              <h2>
                <Users size={18} /> Students
              </h2>
              <p>{students.length} total</p>
              <ul>
                {students.slice(0, 5).map(s => (
                  <li key={s._id} className={styles.listItem}>
                    {s.name}
                    <button onClick={() => handleDeleteStudent(s._id)} className={styles.button}>
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Courses */}
            <section className={styles.section}>
              <h2>
                <BookOpen size={18} /> Courses
              </h2>
              <p>{courses.length} total</p>
              <ul>
                {courses.slice(0, 5).map(c => (
                  <li key={c._id} className={styles.listItem}>
                    {c.title}
                    <button onClick={() => handleDeleteCourse(c._id)} className={styles.button}>
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Enroll */}
            <section className={styles.section}>
              <h2>
                <PlusCircle size={18} /> Enroll
              </h2>
              <select
                className={styles.select}
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                className={styles.select}
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <button
                onClick={handleEnroll}
                disabled={enrollLoading}
                className={styles.enrollButton}
              >
                {enrollLoading ? 'Enrolling...' : 'Enroll'}
              </button>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
