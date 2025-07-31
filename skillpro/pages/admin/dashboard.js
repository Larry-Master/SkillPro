import { useEffect, useState } from "react";
import Head from "next/head";
import CreateCourse from "@/pages/admin/createCourse";
import styles from "@/pages/admin/AdminDashboard.module.css";

import { Users, BookOpen, PlusCircle, Loader2, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [studentsLoading, setStudentsLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/students");
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Error loading students:", err);
      } finally {
        setStudentsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleDelete = async (id, type) => {
    if (!confirm(`Delete this ${type.toLowerCase()}?`)) return;
    try {
      const res = await fetch(`/api/${type.toLowerCase()}s/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      if (type === "Student") {
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } else if (type === "Course") {
        setCourses((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert(`Error deleting ${type.toLowerCase()}`);
    }
  };

  async function handleEnroll() {
    if (!selectedStudent || !selectedCourse) {
      alert("Select both student and course");
      return;
    }

    setEnrollLoading(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent,
          courseId: selectedCourse,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to enroll");
      alert("Enrollment successful!");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setEnrollLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>
          <Users size={28} style={{ marginRight: "12px" }} />
          Admin Dashboard
        </h1>
        <div className={styles.sectionsWrapper}>
          {/* Students Section */}
          <section className={styles.section}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>
              <Users size={20} /> Students
            </h2>
            {studentsLoading ? (
              <p style={{ color: '#4f8cff', fontWeight: 600 }}>
                <Loader2 className="animate-spin" /> Loading students...
              </p>
            ) : (
              <>
                <p style={{ color: '#6b7280', fontSize: '0.98rem', marginBottom: 8 }}>{students.length} total</p>
                <ul className={styles.scrollableList}>
                  {students.map((s) => (
                    <li key={s._id} className={styles.listItem}>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                      <button
                        onClick={() => handleDelete(s._id, "Student")}
                        className={styles.button}
                        title="Delete Student"
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
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>
              <BookOpen size={20} /> Courses
            </h2>
            {coursesLoading ? (
              <p style={{ color: '#4f8cff', fontWeight: 600 }}>
                <Loader2 className="animate-spin" /> Loading courses...
              </p>
            ) : (
              <>
                <p style={{ color: '#6b7280', fontSize: '0.98rem', marginBottom: 8 }}>{courses.length} total</p>
                <ul className={styles.scrollableList}>
                  {courses.map((c) => (
                    <li key={c._id} className={styles.listItem}>
                      <span style={{ fontWeight: 600 }}>{c.title}</span>
                      <button
                        onClick={() => handleDelete(c._id, "Course")}
                        className={styles.button}
                        title="Delete Course"
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
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>
              <PlusCircle size={20} /> Create Course
            </h2>
            <CreateCourse
              onCourseCreated={(newCourse) =>
                setCourses((prev) => [newCourse, ...prev])
              }
            />
          </section>

          {/* Enroll Section */}
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
        </div>
      </main>
    </>
  );
}
