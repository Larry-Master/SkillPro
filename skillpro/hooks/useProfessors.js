import { useState, useEffect } from 'react';
import { professorsApi } from '@/lib/api';

export function useProfessors() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    professorsApi.getAll()
      .then(setProfessors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { professors, loading };
}
