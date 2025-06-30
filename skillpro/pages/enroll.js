// pages/enroll.js
import Head from 'next/head';
import '@/styles/global.css';

export default function EnrollPage({ courses }) {
  function enroll(courseTitle) {
    alert(`You have enrolled in ${courseTitle}!`);
  }

  return (
    <>
      <Head>
        <title>Course Enrollment</title>
      </Head>
      <main>
        <h1>Welcome to the Enrollment Page!</h1>

        <p>Choose which course to enroll:</p>

        <ul>
          {courses.map((course) => (
            <li key={course._id}>
              {course.title}{' '}
              <button onClick={() => enroll(course.title)}>Enroll</button>
            </li>
          ))}
        </ul>

        <p className="signature">
          Signed,<br />
          HTW Berlin 🦄
        </p>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/courses');
  const courses = await res.json();

  return {
    props: { courses },
  };
}
