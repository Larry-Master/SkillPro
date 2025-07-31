import Head from "next/head";
import { useEffect, useState } from "react";

export default function EnrollPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  function enroll(courseTitle) {
    alert(`You have enrolled in ${courseTitle}!`);
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Course Enrollment</title>
        </Head>
        <main>
          <h1>Welcome to the Enrollment Page!</h1>
          <p>Loading courses...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Course Enrollment</title>
      </Head>
      <main>
        <h1>Welcome to the Enrollment Page!</h1>

        <p>Choose which course to enroll:</p>

        {courses.length > 0 ? (
          <ul>
            {courses.map((course) => (
              <li key={course._id}>
                {course.title}{" "}
                <button
                  aria-label={`Enroll in ${course.title}`}
                  onClick={() => enroll(course.title)}
                >
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses available at the moment.</p>
        )}

        <p className="signature">
          Signed,
          <br />
          HTW Berlin 🦄
        </p>
      </main>
    </>
  );
}
