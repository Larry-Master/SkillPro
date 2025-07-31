import Head from "next/head";

export default function EnrollPage({ courses = [] }) {
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

export async function getServerSideProps(context) {
  try {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = context.req.headers.host; // localhost:3000 or deployed domain
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/courses`);
    
    if (!res.ok) {
      console.error(`API returned ${res.status}`);
      return {
        props: { courses: [] },
      };
    }
    
    const courses = await res.json();

    return {
      props: { courses: courses || [] },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: { courses: [] },
    };
  }
}
