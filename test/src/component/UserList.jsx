import { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css"; // import file css

function UserList() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      axios
        .put(`http://localhost:5000/users/${editingUser.id}`, formData)
        .then(() => {
          fetchUsers();
          setFormData({ name: "", email: "", password: "" });
          setEditingUser(null);
        });
    } else {
      axios.post("http://localhost:5000/users", formData).then(() => {
        fetchUsers();
        setFormData({ name: "", email: "", password: "" });
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      axios
        .delete(`http://localhost:5000/users/${id}`)
        .then(() => fetchUsers());
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
    });
  };

  return (
    <div className="container">
      <h1>Quản lý người dùng</h1>

      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <div className="btn-container">
          <button type="submit" className="btn btn-add">
            {editingUser ? "Cập nhật" : "Thêm mới"}
          </button>
          {editingUser && (
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => {
                setEditingUser(null);
                setFormData({ name: "", email: "", password: "" });
              }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            <div>
              <strong>ID:</strong> {user.id} | <strong>Name:</strong>{" "}
              {user.name} | <strong>Email:</strong> {user.email} |{" "}
              <strong>Password:</strong> {user.password}
            </div>
            <div className="button-group">
              <button className="btn-edit" onClick={() => handleEdit(user)}>
                Sửa
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(user.id)}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
