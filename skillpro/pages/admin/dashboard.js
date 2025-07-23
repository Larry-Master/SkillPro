import { useEffect, useState } from 'react';
import Head from 'next/head';
import CreateCourse from './createCourse';
import styles from './AdminDashboard.module.css';

import {
  Users,
  BookOpen,
  PlusCircle,
  Loader2,
  Trash2,
} from 'lucide-react';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [studentsLoading, setStudentsLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error('Error loading students:', err);
      } finally {
        setStudentsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setCoursesLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleDelete = async (id, type) => {
    if (!confirm(`Delete this ${type.toLowerCase()}?`)) return;
    try {
      const res = await fetch(`/api/${type.toLowerCase()}s/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      
      if (type === 'Student') {
        setStudents(prev => prev.filter(s => s._id !== id));
      } else if (type === 'Course') {
        setCourses(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert(`Error deleting ${type.toLowerCase()}`);
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

        <div className={styles.sectionsWrapper}>
          {/* Students Section */}
          <section className={styles.section}>
            <h2>
              <Users size={18} /> Students
            </h2>
            {studentsLoading ? (
              <p><Loader2 /> Loading students...</p>
            ) : (
              <>
                <p>{students.length} total</p>
                <ul className={styles.scrollableList}>
                {students.map(s => (
                  <li key={s._id} className={styles.listItem}>
                  {s.name}
                  <button onClick={() => handleDelete(s._id, 'Student')} className={styles.button}>
                  <Trash2 size={16} />
                  </button>
                  </li>
                ))}
                </ul>
              </>
            )}
          </section>

          {/* Courses Section */}
          <section className={styles.section}>
            <h2>
              <BookOpen size={18} /> Courses
            </h2>
            {coursesLoading ? (
              <p><Loader2 /> Loading courses...</p>
            ) : (
              <>
                <p>{courses.length} total</p>
                <ul className={styles.scrollableList}>
                {courses.map(c => (
                  <li key={c._id} className={styles.listItem}>
                  {c.title}
                  <button onClick={() => handleDelete(c._id, 'Course')} className={styles.button}>
                  <Trash2 size={16} />
                  </button>
                  </li>
                ))}
                </ul>
              </>
            )}
          </section>

          {/* CreateCourse component */}
          <section className={styles.section}>
          <CreateCourse onCourseCreated={newCourse => setCourses(prev => [newCourse, ...prev])} />
          </section>

          {/* Enroll Section */}
          <section className={styles.section}>
            <h2>
              <PlusCircle size={18} /> Enroll
            </h2>
            <select
              className={styles.select}
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              disabled={studentsLoading}
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
              disabled={coursesLoading}
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
              disabled={enrollLoading || studentsLoading || coursesLoading}
              className={styles.enrollButton}
            >
              {enrollLoading ? 'Enrolling...' : 'Enroll'}
            </button>
          </section>
        </div>
      </main>
    </>
  );
}
