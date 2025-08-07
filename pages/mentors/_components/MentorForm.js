import { useState } from "react";

export default function MentorForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    industry: initialData.industry || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Email:
        <input name="email" value={form.email} onChange={handleChange} required type="email" />
      </label>
      <br />
      <label>
        Branche:
        <input name="industry" value={form.industry} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? "Speichern..." : "Speichern"}
      </button>
    </form>
  );
}

