import Head from "next/head";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>SkillPro – Your Personalized Learning Platform</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Track your enrolled courses, connect with mentors, and accelerate your learning journey" />
      </Head>

      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">SkillPro</span>
            <br />
            <span className="hero-sub">Your Personalized Learning Platform</span>
          </h1>
          <p className="hero-desc">
            Track your enrolled courses, connect with mentors, and accelerate your learning journey with a beautiful, modern platform designed for success.
          </p>
          <div className="hero-buttons">
            <Link href="/dashboard" className="hero-cta">
              Get Started
              <ArrowRight size={20} style={{ marginLeft: "0.5rem" }} />
            </Link>
            <Link href="/enroll" className="btn btn-secondary btn-lg focus-ring">
              Browse Courses
              <BookOpen size={20} style={{ marginLeft: "0.5rem" }} />
            </Link>
          </div>
        </div>
        <div className="hero-graphic">
          <img src="index_heroLogo.png" alt="Online Learning Hero" />
        </div>
      </div>

      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <BookOpen size={32} />
            </div>
            <h3 className="feature-title">Diverse Courses</h3>
            <p className="feature-description">
              Access a wide range of courses from beginner to advanced levels across multiple disciplines.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Users size={32} />
            </div>
            <h3 className="feature-title">Expert Mentors</h3>
            <p className="feature-description">
              Connect with industry professionals who guide you through your learning journey.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3 className="feature-title">Track Progress</h3>
            <p className="feature-description">
              Monitor your learning progress with detailed analytics and personalized insights.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
