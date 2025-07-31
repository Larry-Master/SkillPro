import Head from "next/head";
import { UserPlus, User, Mail, Lock } from "lucide-react";

export default function RegisterForm({ title = "Register" }) {
  return (
    <>
      <Head>
        <title>{title} - SkillPro</title>
        <meta name="description" content="Create your SkillPro account" />
      </Head>
      
      <div className="login-container">
        <div className="login-header">
          <UserPlus size={32} />
          <h1>{title}</h1>
          <p className="subtext">Join the community today!</p>
        </div>

        <form method="POST" action="/register" className="login-form">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              <User size={16} />
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-input"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              <User size={16} />
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-input"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
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
              placeholder="Create a strong password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            Create Account
          </button>

          <div className="form-footer">
            <span>Already have an account?</span>
            <a href="/login" className="link-primary">Sign In</a>
          </div>
        </form>
      </div>
    </>
  );
}
