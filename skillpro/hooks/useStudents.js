import { useState, useEffect } from 'react';
import { studentsApi } from '@/lib/api';

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentsApi.getAll()
      .then(setStudents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteStudent = async (id) => {
    try {
      await studentsApi.delete(id);
      setStudents(prev => prev.filter(s => s._id !== id));
      return true;
    } catch (err) {
      console.error("Delete failed:", err);
      return false;
    }
  };

  return { students, loading, deleteStudent };
}
