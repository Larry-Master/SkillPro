import Head from "next/head";
import { LogIn, User, Lock } from "lucide-react";

export default function LoginPage() {
  const title = "Login";

  return (
    <>
      <Head>
        <title>{title} - SkillPro</title>
        <meta name="description" content="Login to your SkillPro account" />
      </Head>
      
      <div className="login-container">
        <div className="login-header">
          <LogIn size={32} />
          <h1>{title}</h1>
          <p className="subtext">Welcome back! Please login to your account</p>
        </div>

        <form method="POST" action="/login" className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <User size={16} />
              Username / Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email or username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            Login to SkillPro
          </button>

          <div className="form-footer">
            <a href="#" className="link-muted">Forgot Password?</a>
            <span className="separator">•</span>
            <a href="/register" className="link-primary">New User? Sign Up</a>
          </div>
        </form>
      </div>
    </>
  );
}
