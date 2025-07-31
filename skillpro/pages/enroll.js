import Head from "next/head";
import { BookOpen, Users, Clock } from "lucide-react";

export default function EnrollPage({ courses = [], error }) {
  function enroll(courseTitle) {
    alert(`You have successfully enrolled in ${courseTitle}!`);
  }

  return (
    <>
      <Head>
        <title>Course Enrollment - SkillPro</title>
        <meta name="description" content="Browse and enroll in available courses" />
      </Head>
      
      <div className="page-header">
        <h1 className="page-title">
          <BookOpen size={32} />
          Available Courses
        </h1>
        <p className="page-subtitle">Discover and enroll in courses that match your learning goals</p>
      </div>

      {error && (
        <div className="error-message" style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <p>{error}</p>
        </div>
      )}

      <div className="courses-grid">
        {courses.length === 0 && !error ? (
          <div className="empty-state fade-in">
            <BookOpen size={64} />
            <h3>No courses available</h3>
            <p>Check back later for new courses or contact an administrator</p>
          </div>
        ) : courses.length === 0 && error ? (
          <div className="empty-state fade-in">
            <BookOpen size={64} />
            <h3>Unable to load courses</h3>
            <p>Please refresh the page or try again later</p>
          </div>
        ) : (
          courses.map((course, index) => (
            <div key={course._id} className={`course-card-modern hover-lift stagger-item`} style={{animationDelay: `${index * 0.1}s`}}>
              <div className="course-header">
                <h3 className="course-title-modern">{course.title}</h3>
                <span className="course-meta">
                  <Users size={16} />
                  {course.capacity || 'Unlimited'} spots
                </span>
              </div>
              
              {course.description && (
                <p className="course-description">{course.description}</p>
              )}
              
              {course.professor && (
                <p className="course-instructor">
                  👨‍🏫 Instructor: {course.professor.name || course.professor}
                </p>
              )}
              
              <div className="course-footer">
                <div className="course-info">
                  <span className="course-level">
                    {course.level || 'Beginner'}
                  </span>
                  <span className="course-duration">
                    <Clock size={14} />
                    {course.duration || '4-6 weeks'}
                  </span>
                  {course.enrolledStudents && (
                    <span className="course-enrolled">
                      👥 {course.enrolledStudents.length} enrolled
                    </span>
                  )}
                </div>
                <button
                  className="enroll-btn focus-ring"
                  aria-label={`Enroll in ${course.title}`}
                  onClick={() => enroll(course.title)}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="page-footer-note">
        <p>Need help choosing a course? <a href="/about">Contact our advisors</a></p>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = context.req.headers.host; // localhost:3000 or deployed domain
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/courses`);
    
    if (!res.ok) {
      console.error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
      return {
        props: { 
          courses: [],
          error: `Failed to load courses: ${res.status} ${res.statusText}`
        },
      };
    }
    
    const courses = await res.json();

    return {
      props: { courses: courses || [] },
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      props: { 
        courses: [],
        error: "Unable to connect to the database. Please try again later."
      },
    };
  }
}
