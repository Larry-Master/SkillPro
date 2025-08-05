import { PlusCircle } from "lucide-react";
import styles from "@/styles/AdminDashboard.module.css";

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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStudent && selectedCourse && !enrollLoading) {
      handleEnroll();
    }
  };

  const isDisabled = studentsLoading || coursesLoading || enrollLoading;
  const isValid = selectedStudent && selectedCourse;

  return (
    <section className={styles.section}>
      <h2>
        <PlusCircle size={20} /> Enroll
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="student-select" className={styles.label}>
            Select Student *
          </label>
          <select
            id="student-select"
            name="studentId"
            className={styles.select}
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            disabled={isDisabled}
            required
          >
            <option value="">{studentsLoading ? "Loading students..." : "Select Student"}</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="course-select" className={styles.label}>
            Select Course *
          </label>
          <select
            id="course-select"
            name="courseId"
            className={styles.select}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={isDisabled}
            required
          >
            <option value="">{coursesLoading ? "Loading courses..." : "Select Course"}</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!isValid || isDisabled}
          className={styles.enrollButton}
        >
          {enrollLoading ? "Enrolling..." : "Enroll"}
        </button>
      </form>
    </section>
  );
}
