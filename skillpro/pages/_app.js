// pages/_app.js
import '@/styles/global.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <header>
        <h1>My App</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          <a href="/enroll">View Courses</a>
        </nav>
      </header>

      <main>
        <Component {...pageProps} />
      </main>

    </>
  );
}
