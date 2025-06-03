import Head from 'next/head';
import Link from 'next/link';
import '@/styles/global.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>SkillPro – Home (Static)</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main>
        <section>
          <h2>Your Personalized Learning Platform</h2>
          <p>Track your enrolled courses and continue your learning journey effortlessly.</p>
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </section>
      </main>

      <footer>
        <p>© 2025 SkillPro. All rights reserved.</p>
      </footer>
    </>
  );
}
