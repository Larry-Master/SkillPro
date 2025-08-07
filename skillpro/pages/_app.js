import "@/styles/globals.css";
import Link from "next/link";

export default function MyApp({ Component, pageProps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="main-header">
        <div className="header-content">
          <Link href="/" className="logo">SkillPro</Link>
          <nav className="main-nav">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/enroll">Courses</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/admin/dashboard">Admin</Link>
            <Link href="/mentors">Mentors</Link>
          </nav>
        </div>
      </header>
      <div className="page-container" style={{ flex: 1 }}>
        <Component {...pageProps} />
      </div>
      <footer className="main-footer">
        <p>&copy; 2025 SkillPro. Learn. Grow. Succeed.</p>
      </footer>
    </div>
  );
}
