import { Trash2, Users, Loader2 } from "lucide-react";
import styles from "./AdminDashboard.module.css";

export default function StudentList({ students = [], loading, onDelete }) {
  return (
    <section className={styles.section}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>
        <Users size={20} /> Students
      </h2>
      {loading ? (
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
                  onClick={() => onDelete(s._id, "Student")}
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
  );
}
