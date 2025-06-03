import Head from 'next/head';
import Link from 'next/link';
import '@/styles/global.css';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard – SkillPro TEST</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main>
        <section>
          <h2>Enrolled Courses</h2>

          <div className="course-card">
            <div className="course-title">📘 Intro to Web Development</div>
            <p>Continue from Module 3: CSS Basics</p>
            <div className="progress-bar">
              <span style={{ width: '40%' }}></span>
            </div>
          </div>

          <div className="course-card">
            <div className="course-title">📙 JavaScript Essentials</div>
            <p>Next lesson: Functions and Scope</p>
            <div className="progress-bar">
              <span style={{ width: '65%' }}></span>
            </div>
          </div>

          <div className="course-card">
            <div className="course-title">🎨 UI/UX Fundamentals</div>
            <p>Recently Completed: User Research Techniques</p>
            <div className="progress-bar">
              <span style={{ width: '100%' }}></span>
            </div>
          </div>

          <p>
            <Link href="#">View All Courses</Link>
          </p>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 SkillPro. Learn. Grow. Succeed.</p>
      </footer>
    </>
  );
}
