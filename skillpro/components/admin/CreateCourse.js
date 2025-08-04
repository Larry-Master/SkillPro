import { useState } from "react";
import { useProfessors } from "@/hooks/useProfessors";
import { coursesApi } from "@/lib/api";
import styles from "@/styles/CreateCourse.module.css";
import { PlusCircle } from "lucide-react";

export default function CreateCourse({
  onCourseCreated
}) {
  const { professors, loading: professorsLoading } = useProfessors();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [professor, setProfessor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    setLoading(true);

    try {
      const newCourse = await coursesApi.create({ title, description, professor, capacity });
      alert("Course created!");
      onCourseCreated?.(newCourse);
      setTitle("");
      setDescription("");
      setProfessor("");
      setCapacity("");
    } catch (err) {
      console.error("Create course error:", err);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.section}>
      <h2>
        <PlusCircle size={18} /> Create New Course
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className={styles.label}>
            Title *
          </label>
          <input
            id="title"
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="capacity" className={styles.label}>
            Capacity *
          </label>
          <input
            id="capacity"
            type="number"
            className={styles.input}
            min="0"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="professor" className={styles.label}>
            Professor{" "}
          </label>
          <select
            id="professor"
            className={styles.input}
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
          >
            <option value="">Select professor</option>
            {professors.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}
