import { PlusCircle } from "lucide-react";
import styles from "./AdminDashboard.module.css";

export default function EnrollForm({
  students = [],
  courses = [],
  studentsLoading,
  coursesLoading,
  selectedStudent,
  setSelectedStudent,
  selectedCourse,
  setSelectedCourse,
  enrollLoading,
  handleEnroll,
}) {
  return (
    <section className={styles.section}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>
        <PlusCircle size={20} /> Enroll
      </h2>
      <select
        className={styles.select}
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
        disabled={studentsLoading}
      >
        <option value="">Select Student</option>
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
        disabled={coursesLoading}
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>

      <button
        onClick={handleEnroll}
        disabled={enrollLoading || studentsLoading || coursesLoading}
        className={styles.enrollButton}
      >
        {enrollLoading ? "Enrolling..." : "Enroll"}
      </button>
    </section>
  );
}
