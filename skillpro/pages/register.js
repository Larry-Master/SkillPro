import Head from "next/head";
import "@/styles/globals.css";

export default function RegisterForm({ title = "Register" }) {
  return (
    <div className="login-container">
      <h1>{title}</h1>
      <p className="subtext">Join the community today!</p>

      <form method="POST" action="/register">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="Enter your first name"
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Enter your last name"
          required
        />

        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
        />

        <label htmlFor="password">Enter Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create a password"
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
