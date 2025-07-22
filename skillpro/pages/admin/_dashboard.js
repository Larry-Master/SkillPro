import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './AdminDashboard.module.css';  // Import the CSS Module

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // For enrollment UI
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
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleDeleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const res = await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete student');
      setStudents(prev => prev.filter(s => s._id !== studentId));
    } catch (err) {
      console.error(err);
      alert('Error deleting student');
    }
  }

  async function handleDeleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete course');
      setCourses(prev => prev.filter(c => c._id !== courseId));
    } catch (err) {
      console.error(err);
      alert('Error deleting course');
    }
  }

  async function handleEnroll() {
    if (!selectedStudent || !selectedCourse) {
      alert('Please select both a student and a course');
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

      if (!res.ok) throw new Error(data.message || 'Enrollment failed');

      alert('Enrollment successful!');
    } catch (err) {
      console.error(err);
      alert(`Enrollment error: ${err.message}`);
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
        <h1>📊 Admin Dashboard</h1>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <section className={styles.section}>
              <h2>👤 Students Overview</h2>
              <p>Total Students: {students.length}</p>
              <ul>
                {students.slice(0, 5).map(student => (
                  <li key={student._id} className={styles.listItem}>
                    {student.name}
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className={styles.button}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2>📚 Courses</h2>
              <p>Total Courses: {courses.length}</p>
              <ul>
                {courses.slice(0, 5).map(course => (
                  <li key={course._id} className={styles.listItem}>
                    {course.title}
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className={styles.button}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2>➕ Enroll Student in Course</h2>
              <select
                onChange={e => setSelectedStudent(e.target.value)}
                value={selectedStudent}
                className={styles.select}
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                onChange={e => setSelectedCourse(e.target.value)}
                value={selectedCourse}
                className={styles.select}
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
          </>
        )}
      </main>
    </>
  );
}
