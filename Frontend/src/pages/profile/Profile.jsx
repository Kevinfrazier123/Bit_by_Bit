// Frontend/src/pages/profile/Profile.jsx
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const { user, dispatch } = useContext(AuthContext);
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    const res = await axios.put(
      `/users/${user._id}/profile-pic`,
      form,
      { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <img
        src={user.profilePic || "/default-avatar.png"}
        alt="avatar"
        style={{ width: 80, height: 80, borderRadius: "50%" }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload New Picture</button>
    </div>
  );
}
