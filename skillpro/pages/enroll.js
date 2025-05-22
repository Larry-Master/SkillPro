import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import '@/styles/global.css';

export default function EnrollPage({ event_name, student_name, courses, uni_name }) {
  function enroll(courseName) {
    alert(`You have enrolled in ${courseName}!`);
  }

  return (
    <>
      <Head>
        <title>{event_name}</title>
      </Head>
      <main>
        <h1>Welcome to the {event_name}!</h1>

        <p>Hi {student_name}!</p>

        <p>Choose which course to enroll:</p>

        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              {course} <button onClick={() => enroll(course)}>Enroll</button>
            </li>
          ))}
        </ul>

        <p className="signature">
          Signed,<br />
          {uni_name} 🦄
        </p>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'courses.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const parsedData = JSON.parse(jsonData);

  return {
    props: parsedData,
  };
}
