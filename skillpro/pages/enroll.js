import Head from "next/head";
import { useEffect, useState } from "react";
import { BookOpen, Users, Clock, Star, ArrowRight, Loader2 } from "lucide-react";

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
          <meta name="description" content="Browse and enroll in available courses" />
        </Head>
        <div className="page-header">
          <h1 className="page-title">
            <BookOpen size={32} />
            Course Enrollment
          </h1>
          <p className="page-subtitle">Discover your next learning adventure</p>
        </div>
        <div className="loading-container">
          <Loader2 size={32} className="loading-spinner" />
          <p>Loading available courses...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Course Enrollment – SkillPro</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Browse and enroll in available courses" />
      </Head>
      
      <div className="page-header">
        <h1 className="page-title">
          <BookOpen size={32} />
          Course Enrollment
        </h1>
        <p className="page-subtitle">Discover your next learning adventure</p>
      </div>

      {courses.length > 0 ? (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card-modern">
              <div className="course-header">
                <h3 className="course-title-modern">{course.title}</h3>
                <span className="course-level">Beginner</span>
              </div>
              <p className="course-description">
                {course.description || "Expand your skills with this comprehensive course"}
              </p>
              <div className="course-footer">
                <div className="course-info">
                  <span className="course-duration">
                    <Clock size={14} />
                    6 weeks
                  </span>
                  <span className="course-students">
                    <Users size={14} />
                    {course.enrolledStudents?.length || 0} enrolled
                  </span>
                  <span className="course-rating">
                    <Star size={14} />
                    4.8
                  </span>
                </div>
                <button
                  className="btn btn-primary btn-md"
                  aria-label={`Enroll in ${course.title}`}
                  onClick={() => enroll(course.title)}
                >
                  Enroll Now
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No courses available</h3>
          <p>Check back soon for new learning opportunities!</p>
        </div>
      )}
    </>
  );
}
