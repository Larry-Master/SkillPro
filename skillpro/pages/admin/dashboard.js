import Head from "next/head";
import CreateCourse from "@/components/admin/CreateCourse";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { useEnroll } from "@/hooks/useEnroll";
import styles from "@/styles/AdminDashboard.module.css";

import { Users, BookOpen, PlusCircle, Loader2, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const { students, loading: studentsLoading, error: studentsError, deleteStudent } = useStudents();
  const { courses, loading: coursesLoading, error: coursesError, deleteCourse } = useCourses();
  const {
    selectedStudent,
    setSelectedStudent,
    selectedCourse,
    setSelectedCourse,
    enrollLoading,
    error: enrollError,
    handleEnroll
  } = useEnroll();

  const handleDelete = async (id, type) => {
    if (!confirm(`Delete this ${type.toLowerCase()}?`)) return;
    
    const success = type === "Student" 
      ? await deleteStudent(id)
      : await deleteCourse(id);
    
    if (!success) {
      alert(`Error deleting ${type.toLowerCase()}`);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>
          <Users size={24} style={{ marginRight: "8px" }} />
          Admin Dashboard
        </h1>

        <div className={styles.sectionsWrapper}>
          {/* Students Section */}
          <section className={styles.section}>
            <h2>
              <Users size={18} /> Students
            </h2>
            {studentsLoading ? (
              <p>
                <Loader2 /> Loading students...
              </p>
            ) : (
              <>
                <p>{students.length} total</p>
                <ul className={styles.scrollableList}>
                  {students.map((s) => (
                    <li key={s._id} className={styles.listItem}>
                      {s.name}
                      <button
                        onClick={() => handleDelete(s._id, "Student")}
                        className={styles.button}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* Courses Section */}
          <section className={styles.section}>
            <h2>
              <BookOpen size={18} /> Courses
            </h2>
            {coursesLoading ? (
              <p>
                <Loader2 /> Loading courses...
              </p>
            ) : (
              <>
                <p>{courses.length} total</p>
                <ul className={styles.scrollableList}>
                  {courses.map((c) => (
                    <li key={c._id} className={styles.listItem}>
                      {c.title}
                      <button
                        onClick={() => handleDelete(c._id, "Course")}
                        className={styles.button}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* CreateCourse component */}
          <section className={styles.section}>
            <CreateCourse
              onCourseCreated={(newCourse) =>
                setCourses((prev) => [newCourse, ...prev])
              }
            />
          </section>

          {/* Enroll Section */}
          <section className={styles.section}>
            <h2>
              <PlusCircle size={18} /> Enroll
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
        </div>
      </main>
    </>
  );
}
