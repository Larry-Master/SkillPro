// pages/mentors/_components/MentorTable.js
import Link from 'next/link';

export default function MentorTable({ mentors, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Industry</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {mentors.map(m => (
          <tr key={m._id}>
            <td>{m.name}</td>
            <td>{m.email}</td>
            <td>{m.industry}</td>
            <td>
              <Link href={`/mentors/${m._id}`}><a>Edit</a></Link>
              {' | '}
              <button onClick={() => onDelete(m._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
