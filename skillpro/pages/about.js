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
        <div className="team-title">
          <Users size={24} />
          Our Team
        </div>
        <div className="team-grid">
          <div className="team-member">
            <a
      className="member-avatar"
      href="https://github.com/Aidaika09" // <-- Replace with actual GitHub URL
      target="_blank"
      rel="noopener noreferrer"
      title="Aidai on GitHub"
    ></a>
            <div className="member-avatar image">
            <img src="/avatars/aidai.jpg" alt="Aidai" />
            <h3>Aidai</h3>
        </div>
      </div>
      <div className="team-member">
        <a
      className="member-avatar"
      href="https://github.com/Larry-Master" // <-- Replace with actual GitHub URL
      target="_blank"
      rel="noopener noreferrer"
      title="Larry on GitHub"
    ></a>
            <div className="member-avatar image">
            <img src="/avatars/larry.jpg" alt="Larry" />
            </div>
            <h3>Larry</h3>
            </div>
            <div className="team-member">
            <a
      className="member-avatar"
      href="https://github.com/nicolemk12" // <-- Replace with actual GitHub URL
      target="_blank"
      rel="noopener noreferrer"
      title="Nicole on GitHub"
    ></a>
            <div className="member-avatar image">
            <img src="/avatars/nicole.jpg" alt="Nicole" />
            </div> 
            <h3>Nicole</h3>
            <div className="page-footer-note">
              </div>
              </div>
              </div>
             
      
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
