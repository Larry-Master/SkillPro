import Head from "next/head";

export default function LoginPage() {
  const title = "Login";

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="login-container">
        <h1>{title}</h1>
        <p className="subtext">Welcome back! Please login to your account!</p>

        <form method="POST" action="/login">
          <label htmlFor="email">Username / Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email or username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>

          <div className="extra-links">
            <a href="#">Forgot Password?</a>
            <span> | </span>
            <a href="/register">New User? Signup</a>
          </div>
        </form>
      </div>
    </>
  );
}
