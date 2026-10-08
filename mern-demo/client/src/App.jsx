import { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/students` : '/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const loadStudents = () => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(setStudents)
      .catch(err => console.error('Load error:', err));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${BASE_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setForm({ studentId: '', name: '', email: '' });
    loadStudents();
  };

  const handleEdit = (student) => {
    setForm({ studentId: student.studentId, name: student.name, email: student.email });
    setEditingId(student._id);
  };

  const handleCancelEdit = () => {
    setForm({ studentId: '', name: '', email: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    loadStudents();
  };

  return (
    <div style={{ maxWidth: 650, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Quản lý sinh viên</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          placeholder="MSSV"
          value={form.studentId}
          onChange={e => setForm({ ...form, studentId: e.target.value })}
          required
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Họ tên"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          style={{ marginRight: 8 }}
        />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm'}</button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
            Hủy
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleEdit(s)} style={{ marginRight: 8 }}>Sửa</button>
                <button onClick={() => handleDelete(s._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
