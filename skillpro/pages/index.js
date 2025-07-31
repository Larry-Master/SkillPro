import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>SkillPro – Home</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <main className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-gradient">SkillPro</span>
            <br />
            <span className="hero-sub">Your Personalized Learning Platform</span>
          </h1>
          <p className="hero-desc">
            Track your enrolled courses, connect with mentors, and accelerate your learning journey with a beautiful, modern platform.
          </p>
          <Link href="/dashboard" className="hero-cta">Go to Dashboard</Link>
        </div>
        <div className="hero-graphic">
          <img src="/globe.svg" alt="Learning Globe" />
        </div>
      </main>
      <footer className="home-footer">
        <p>&copy; 2025 SkillPro. Learn. Grow. Succeed.</p>
      </footer>
    </>
  );
}
