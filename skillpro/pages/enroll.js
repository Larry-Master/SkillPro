import Head from "next/head";
import { useEffect, useState } from "react";
import { BookOpen, User, Clock, GraduationCap, BookX } from "lucide-react";

export default function EnrollPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  function enroll(courseTitle) {
    alert(`You have enrolled in ${courseTitle}!`);
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Course Enrollment – SkillPro</title>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="Enroll in courses to start your learning journey" />
        </Head>

        <div className="page-header">
          <h1 className="page-title">
            <GraduationCap size={32} />
            Course Enrollment
          </h1>
          <p className="page-subtitle">Choose a course to begin your learning journey</p>
        </div>

        <main>
          <div className="empty-state">
            <div className="loading"></div>
            <h3>Loading courses...</h3>
            <p>Please wait while we fetch available courses</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Course Enrollment – SkillPro</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Enroll in courses to start your learning journey" />
      </Head>

      <div className="page-header">
        <h1 className="page-title">
          <GraduationCap size={32} />
          Course Enrollment
        </h1>
        <p className="page-subtitle">Choose a course to begin your learning journey</p>
      </div>

      <main>
        {courses.length > 0 ? (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card-modern">
                <div className="course-header">
                  <h3 className="course-title-modern" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={20} />
                    {course.title}
                  </h3>
                </div>
                
                {course.description && (
                  <p className="course-description">{course.description}</p>
                )}
                
                {course.instructor && (
                  <p className="course-instructor" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={14} />
                    Instructor: {course.instructor}
                  </p>
                )}
                
                <div className="course-footer">
                  <div className="course-info">
                    {course.level && (
                      <span className="course-level">{course.level}</span>
                    )}
                    {course.duration && (
                      <span className="course-duration">
                        <Clock size={14} />
                        {course.duration}
                      </span>
                    )}
                  </div>
                  <button
                    className="enroll-btn"
                    aria-label={`Enroll in ${course.title}`}
                    onClick={() => enroll(course.title)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <BookX size={48} />
            <h3>No courses available</h3>
            <p>Check back later for new courses!</p>
          </div>
        )}

        <div className="page-footer">
          <p className="signature">
            Signed,
            <br />
            HTW Berlin 🦄
          </p>
        </div>
      </main>
    </>
  );
}
