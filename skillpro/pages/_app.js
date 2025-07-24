import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <header>
        <h1>SkillPro - Your personal Learning Platform</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          <a href="/enroll">View Courses</a>
          <a href="/admin/dashboard">Admin Dashboard</a>
        </nav>
      </header>

      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
