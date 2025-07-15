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


export async function getServerSideProps(context) {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = context.req.headers.host; // localhost:3000 or deployed domain
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/courses`);
  const courses = await res.json();

  return {
    props: { courses },
  };
}

it('uses https in production for getServerSideProps', async () => {
  process.env.NODE_ENV = 'production'; // Simulate production

  const context = {
    req: { headers: { host: 'example.com' } },
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ _id: '3', title: 'Physics 303' }]),
    })
  );

  const result = await getServerSideProps(context);

  expect(fetch).toHaveBeenCalledWith('https://example.com/api/courses');
  expect(result).toEqual({
    props: {
      courses: [{ _id: '3', title: 'Physics 303' }],
    },
  });

  process.env.NODE_ENV = 'test'; // Reset for safety
});
