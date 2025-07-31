import { Trash2, BookOpen, Loader2, RotateCcw } from "lucide-react";
import styles from "./AdminDashboard.module.css";

export default function CourseList({ courses = [], loading, error, onDelete, onRefresh }) {
  return (
    <section className={styles.section}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>
          <BookOpen size={20} /> Courses
        </h2>
        {(error || (!loading && courses.length === 0)) && (
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              fontSize: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <RotateCcw size={12} />
            Retry
          </button>
        )}
      </div>
      {loading ? (
        <p style={{ color: '#4f8cff', fontWeight: 600 }}>
          <Loader2 className="animate-spin" /> Loading courses...
        </p>
      ) : error ? (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#dc2626', 
          padding: '0.75rem', 
          borderRadius: '0.375rem', 
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          <p>Error: {error}</p>
        </div>
      ) : (
        <>
          <p style={{ color: '#6b7280', fontSize: '0.98rem', marginBottom: 8 }}>
            {courses.length} {courses.length === 1 ? 'course' : 'courses'} total
          </p>
          {courses.length === 0 ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No courses found</p>
          ) : (
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
          )}
        </>
      )}
    </section>
  );
}
