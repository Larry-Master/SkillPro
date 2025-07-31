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
  const [studentsError, setStudentsError] = useState("");
  const [coursesError, setCoursesError] = useState("");

  const [studentsLoading, setStudentsLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await fetch("/api/students");
      if (!res.ok) {
        throw new Error(`Failed to fetch students: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setStudents(data);
      setStudentsError("");
    } catch (err) {
      console.error("Error loading students:", err);
      setStudentsError(err.message || "Failed to load students");
    } finally {
      setStudentsLoading(false);
    }
  };

  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) {
        throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setCourses(data);
      setCoursesError("");
    } catch (err) {
      console.error("Error loading courses:", err);
      setCoursesError(err.message || "Failed to load courses");
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
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
            error={studentsError} 
            onDelete={handleDelete}
            onRefresh={fetchStudents}
          />

          {/* Courses Section */}
          <CourseList 
            courses={courses} 
            loading={coursesLoading} 
            error={coursesError} 
            onDelete={handleDelete}
            onRefresh={fetchCourses}
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
            studentsError={studentsError}
            coursesError={coursesError}
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
