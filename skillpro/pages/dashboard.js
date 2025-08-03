import Head from "next/head";
import Link from "next/link";
import { BookOpen, TrendingUp, Award, ArrowRight, User, Clock } from "lucide-react";
import styles from "@/styles/Dashboard.module.css";
import courseStyles from "@/styles/Course.module.css";
import pageStyles from "@/styles/Page.module.css";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard – SkillPro</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Your personal learning dashboard" />
      </Head>

      <div className={pageStyles.pageHeader}>
        <h1 className={pageStyles.pageTitle}>
          <User size={32} />
          My Dashboard
        </h1>
        <p className={pageStyles.pageSubtitle}>Track your learning progress and continue your journey</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>3</div>
          <div className={styles.statLabel}>Active Courses</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>68%</div>
          <div className={styles.statLabel}>Avg. Progress</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>24</div>
          <div className={styles.statLabel}>Hours Learned</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>1</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
      </div>

      <div className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>
          <BookOpen size={24} />
          My Courses
        </h2>

        <div className={courseStyles.coursesGrid}>
          <div className={courseStyles.courseCardModern}>
            <div className={courseStyles.courseHeader}>
              <h3 className={courseStyles.courseTitleModern}>📘 Intro to Web Development</h3>
              <span className={courseStyles.courseLevel}>Beginner</span>
            </div>
            <p className={courseStyles.courseDescription}>Continue from Module 3: CSS Basics</p>
            <div className={courseStyles.courseFooter}>
              <div className={courseStyles.courseInfo}>
                <span className={courseStyles.courseDuration}>
                  <Clock size={14} />
                  6 weeks
                </span>
                <span className={styles.courseMeta}>
                  <TrendingUp size={14} />
                  40% complete
                </span>
              </div>
              <Link href="/courses/web-development" className="btn btn-primary btn-sm">
                Continue
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.progressBar}>
              <span style={{ width: "40%" }}></span>
            </div>
          </div>

          <div className={courseStyles.courseCardModern}>
            <div className={courseStyles.courseHeader}>
              <h3 className={courseStyles.courseTitleModern}>📙 JavaScript Essentials</h3>
              <span className={courseStyles.courseLevel}>Intermediate</span>
            </div>
            <p className={courseStyles.courseDescription}>Next lesson: Functions and Scope</p>
            <div className={courseStyles.courseFooter}>
              <div className={courseStyles.courseInfo}>
                <span className={courseStyles.courseDuration}>
                  <Clock size={14} />
                  8 weeks
                </span>
                <span className={styles.courseMeta}>
                  <TrendingUp size={14} />
                  65% complete
                </span>
              </div>
              <Link href="/courses/javascript-essentials" className="btn btn-primary btn-sm">
                Continue
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.progressBar}>
              <span style={{ width: "65%" }}></span>
            </div>
          </div>

          <div className={`${courseStyles.courseCardModern} ${courseStyles.completed}`}>
            <div className={courseStyles.courseHeader}>
              <h3 className={courseStyles.courseTitleModern}>🎨 UI/UX Fundamentals</h3>
              <span className={courseStyles.courseLevel}>Advanced</span>
            </div>
            <p className={courseStyles.courseDescription}>Recently Completed: User Research Techniques</p>
            <div className={courseStyles.courseFooter}>
              <div className={courseStyles.courseInfo}>
                <span className={courseStyles.courseDuration}>
                  <Clock size={14} />
                  10 weeks
                </span>
                <span className={styles.courseMeta}>
                  <Award size={14} />
                  Completed!
                </span>
              </div>
              <Link href="/certificates/python-programming" className="btn btn-secondary btn-sm">
                View Certificate
                <Award size={16} />
              </Link>
            </div>
            <div className={styles.progressBar}>
              <span style={{ width: "100%" }}></span>
            </div>
          </div>
        </div>

        <div className={styles.pageFooterNote}>
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
