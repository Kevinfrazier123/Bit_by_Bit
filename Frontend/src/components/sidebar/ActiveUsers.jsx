import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ActiveUsers.css";

export default function ActiveUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/users/active");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch active users:", err);
      }
    })();
  }, []);

  return (
    <aside className="active-users">
      <h3>Active Users</h3>
      <ul className="active-list">
        {users.map((u) => (
          <li key={u._id} className="active-item">
            <span className="status-dot" />
            <img
              src={u.profilePic || "/default-avatar.png"}
              alt={u.username}
              className="active-avatar"
            />
            <span className="active-name">{u.username}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
