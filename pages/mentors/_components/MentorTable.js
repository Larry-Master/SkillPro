export default function MentorTable({ mentors, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Branche</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {mentors.map((mentor) => (
          <tr key={mentor.id || mentor._id}>
            <td>{mentor.name}</td>
            <td>{mentor.email}</td>
            <td>{mentor.industry}</td>
            <td>
              {onEdit && (
                <button onClick={() => onEdit(mentor.id || mentor._id)}>Bearbeiten</button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(mentor.id || mentor._id)}>Löschen</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
