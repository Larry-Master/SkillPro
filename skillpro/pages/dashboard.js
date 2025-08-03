import Head from "next/head";
import Link from "next/link";
import { BookOpen, TrendingUp, Award, ArrowRight, User, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard – SkillPro</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Your personal learning dashboard" />
      </Head>

      <div className="page-header">
        <h1 className="page-title">
          <User size={32} />
          My Dashboard
        </h1>
        <p className="page-subtitle">Track your learning progress and continue your journey</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">3</div>
          <div className="stat-label">Active Courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">68%</div>
          <div className="stat-label">Avg. Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24</div>
          <div className="stat-label">Hours Learned</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">1</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>
          <BookOpen size={24} />
          My Courses
        </h2>

        <div className="courses-grid">
          <div className="course-card-modern">
            <div className="course-header">
              <h3 className="course-title-modern">📘 Intro to Web Development</h3>
              <span className="course-level">Beginner</span>
            </div>
            <p className="course-description">Continue from Module 3: CSS Basics</p>
            <div className="course-footer">
              <div className="course-info">
                <span className="course-duration">
                  <Clock size={14} />
                  6 weeks
                </span>
                <span className="course-meta">
                  <TrendingUp size={14} />
                  40% complete
                </span>
              </div>
              <Link href="/courses/web-development" className="btn btn-primary btn-sm">
                Continue
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="progress-bar">
              <span style={{ width: "40%" }}></span>
            </div>
          </div>

          <div className="course-card-modern">
            <div className="course-header">
              <h3 className="course-title-modern">📙 JavaScript Essentials</h3>
              <span className="course-level">Intermediate</span>
            </div>
            <p className="course-description">Next lesson: Functions and Scope</p>
            <div className="course-footer">
              <div className="course-info">
                <span className="course-duration">
                  <Clock size={14} />
                  8 weeks
                </span>
                <span className="course-meta">
                  <TrendingUp size={14} />
                  65% complete
                </span>
              </div>
              <Link href="/courses/javascript-essentials" className="btn btn-primary btn-sm">
                Continue
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="progress-bar">
              <span style={{ width: "65%" }}></span>
            </div>
          </div>

          <div className="course-card-modern">
            <div className="course-header">
              <h3 className="course-title-modern">🎨 UI/UX Fundamentals</h3>
              <span className="course-level">Advanced</span>
            </div>
            <p className="course-description">Recently Completed: User Research Techniques</p>
            <div className="course-footer">
              <div className="course-info">
                <span className="course-duration">
                  <Clock size={14} />
                  10 weeks
                </span>
                <span className="course-meta">
                  <Award size={14} />
                  Completed!
                </span>
              </div>
              <Link href="/certificates/python-programming" className="btn btn-secondary btn-sm">
                View Certificate
                <Award size={16} />
              </Link>
            </div>
            <div className="progress-bar">
              <span style={{ width: "100%" }}></span>
            </div>
          </div>
        </div>

        <div className="page-footer-note">
          <p>
            <Link href="/enroll" className="btn btn-primary">
              <BookOpen size={18} />
              Browse All Courses
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
