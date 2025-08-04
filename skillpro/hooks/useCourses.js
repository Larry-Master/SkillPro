import { useState, useEffect } from 'react';
import { coursesApi } from '@/lib/api';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApi.getAll()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteCourse = async (id) => {
    try {
      await coursesApi.delete(id);
      setCourses(prev => prev.filter(c => c._id !== id));
      return true;
    } catch (err) {
      console.error("Delete failed:", err);
      return false;
    }
  };

  return { courses, loading, deleteCourse };
}
