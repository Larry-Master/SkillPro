import { useEffect, useState } from "react";
import Head from "next/head";
import CreateCourse from "@/pages/admin/createCourse";
import StudentList from "@/pages/admin/StudentList";
import CourseList from "@/pages/admin/CourseList";
import EnrollForm from "@/pages/admin/EnrollForm";
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
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading students:", err);
        setStudents([]);
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
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading courses:", err);
        setCourses([]);
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
          <StudentList 
            students={students} 
            loading={studentsLoading} 
            onDelete={handleDelete}
          />

          {/* Courses Section */}
          <CourseList 
            courses={courses} 
            loading={coursesLoading} 
            onDelete={handleDelete}
          />

          {/* CreateCourse component */}
          <section className={styles.section}>
            <CreateCourse onCourseCreated={newCourse => setCourses(prev => [newCourse, ...prev])} />
          </section>

          {/* Enroll Section */}
          <EnrollForm
            students={students}
            courses={courses}
            studentsLoading={studentsLoading}
            coursesLoading={coursesLoading}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            enrollLoading={enrollLoading}
            handleEnroll={handleEnroll}
          />
        </div>
      </main>
    </>
  );
}
