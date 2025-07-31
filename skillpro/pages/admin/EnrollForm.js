import { PlusCircle } from "lucide-react";
import styles from "./AdminDashboard.module.css";

export default function EnrollForm({
  students = [],
  courses = [],
  studentsLoading,
  coursesLoading,
  studentsError,
  coursesError,
  selectedStudent,
  setSelectedStudent,
  selectedCourse,
  setSelectedCourse,
  enrollLoading,
  handleEnroll,
}) {
  const hasErrors = studentsError || coursesError;
  const canEnroll = !studentsLoading && !coursesLoading && !hasErrors && students.length > 0 && courses.length > 0;

  return (
    <section className={styles.section}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>
        <PlusCircle size={20} /> Enroll
      </h2>
      
      {hasErrors && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#dc2626', 
          padding: '0.75rem', 
          borderRadius: '0.375rem', 
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          {studentsError && <p>Students: {studentsError}</p>}
          {coursesError && <p>Courses: {coursesError}</p>}
        </div>
      )}
      
      <select
        className={styles.select}
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
        disabled={studentsLoading || studentsError}
      >
        <option value="">
          {studentsLoading ? "Loading students..." : studentsError ? "Error loading students" : students.length === 0 ? "No students available" : "Select Student"}
        </option>
        {students.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        disabled={coursesLoading || coursesError}
      >
        <option value="">
          {coursesLoading ? "Loading courses..." : coursesError ? "Error loading courses" : courses.length === 0 ? "No courses available" : "Select Course"}
        </option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>

      <button
        onClick={handleEnroll}
        disabled={enrollLoading || !canEnroll || !selectedStudent || !selectedCourse}
        className={styles.enrollButton}
      >
        {enrollLoading ? "Enrolling..." : !canEnroll ? "Cannot Enroll" : "Enroll"}
      </button>
    </section>
  );
}
