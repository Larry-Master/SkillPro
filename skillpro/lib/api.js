// Simple API utility
export const api = async (url, options = {}) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// Simple API functions
export const studentsApi = {
  getAll: () => api('/api/students'),
  delete: (id) => api(`/api/students/${id}`, { method: 'DELETE' }),
};

export const coursesApi = {
  getAll: () => api('/api/courses'),
  delete: (id) => api(`/api/courses/${id}`, { method: 'DELETE' }),
  create: (data) => api('/api/courses', { method: 'POST', body: JSON.stringify(data) }),
};

export const professorsApi = {
  getAll: () => api('/api/professors'),
};

export const enrollApi = {
  enroll: (studentId, courseId) => api('/api/enroll', {
    method: 'POST',
    body: JSON.stringify({ studentId, courseId })
  }),
};
