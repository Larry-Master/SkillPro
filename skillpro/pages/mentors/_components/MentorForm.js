// pages/mentors/_components/MentorForm.js
import { useState } from 'react';

export default function MentorForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', industry: '', ...initialData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Industry</label>
        <input name="industry" value={form.industry} onChange={handleChange} required />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
}