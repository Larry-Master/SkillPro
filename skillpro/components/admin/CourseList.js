import { Trash2, BookOpen, Loader2 } from "lucide-react";
import styles from "@/styles/AdminDashboard.module.css";

export default function CourseList({ courses = [], loading, onDelete }) {
  return (
    <section className={styles.section}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>
        <BookOpen size={20} /> Courses
      </h2>
      {loading ? (
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
                  onClick={() => onDelete(c._id, "Course")}
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
  );
}
