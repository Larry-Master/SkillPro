import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <main>
        <h1>📊 Admin Dashboard</h1>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <section>
              <h2>👤 Students Overview</h2>
              <p>Total Students: {students.length}</p>
              <ul>
                {students.slice(0, 5).map((student) => (
                  <li key={student._id}>
                    {student.name} — Progress: {student.progress || 'N/A'}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2>📚 Courses</h2>
              <p>Total Courses: {courses.length}</p>
              <ul>
                {courses.slice(0, 5).map((course) => (
                  <li key={course._id}>{course.title}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </>
  );
}
