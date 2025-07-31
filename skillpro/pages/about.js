import Head from "next/head";
import Link from "next/link";
import { Target, Users, BookOpen, Award, Heart, Zap } from "lucide-react";

export default function About() {
  return (
    <>
      <Head>
        <title>About – SkillPro</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Learn about SkillPro's mission to empower learners worldwide" />
      </Head>

      <div className="about-hero">
        <div className="about-content">
          <h1 className="page-title">
            <Heart size={40} />
            About SkillPro
          </h1>
          <p className="hero-desc">
            Empowering learners worldwide with structured, accessible, and personalized education
          </p>
        </div>
      </div>

      <div className="about-section">
        <h2>
          <Target size={24} />
          Our Mission
        </h2>
        <p>
          SkillPro is an intuitive learning platform designed to help users
          stay focused on their enrolled courses. We believe that education should be 
          accessible to everyone, regardless of their background or location.
        </p>
        <p>
          We aim to make learning structured, accessible, and tailored to each
          user's needs. Our platform combines modern technology with proven educational 
          methodologies to create an engaging learning experience.
        </p>
      </div>

      <div className="about-section">
        <h2>
          <Zap size={24} />
          What Makes Us Different
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <BookOpen size={24} />
            </div>
            <h3 className="feature-title">Structured Learning</h3>
            <p className="feature-description">
              Our courses are designed with clear learning paths and milestones to keep you on track.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Users size={24} />
            </div>
            <h3 className="feature-title">Expert Instructors</h3>
            <p className="feature-description">
              Learn from industry professionals who bring real-world experience to every lesson.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Award size={24} />
            </div>
            <h3 className="feature-title">Recognized Certificates</h3>
            <p className="feature-description">
              Earn certificates that are valued by employers and help advance your career.
            </p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>
          <Users size={24} />
          Our Team
        </h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">SP</div>
            <h3>SkillPro Team</h3>
            <p>Passionate educators and developers</p>
          </div>
          
          <div className="team-member">
            <div className="member-avatar">HB</div>
            <h3>HTW Berlin</h3>
            <p>Academic Excellence</p>
          </div>
        </div>
      </div>

      <div className="page-footer-note">
        <p>
          Ready to start your learning journey?{" "}
          <Link href="/register" className="btn btn-primary">
            Join SkillPro Today
          </Link>
        </p>
      </div>
    </>
  );
}
