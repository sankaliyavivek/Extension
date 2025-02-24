import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login"); // Redirect if not logged in
    } else {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="text-center border p-4 rounded shadow bg-light" style={{ width: "350px" }}>
        <h2>Welcome, {user?.name}!</h2>
        <p>Email: {user?.email}</p>
        <button onClick={handleLogout} className="btn btn-danger w-100">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;