import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import './App.css'

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:7000/extensionuser/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully. Now you can log in.");
      setIsRegistered(true);
    } catch (error) {
      alert("Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7000/extensionuser/login", {
        email,
        password,
      });

      alert("Login successful");
      setUser(response.data.user);
      setIsLoggedIn(true);

      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsRegistered(false);
    localStorage.removeItem("user");
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="text-center border p-4 rounded shadow bg-light"
        style={{
          width: "350px",
          maxWidth: "90%",
          backgroundColor: "#f8f9fa",
        }}
      >
        {!isLoggedIn ? (
          <div>
            {isRegistered ? (
              <>
                <h2>Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mb-2"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mb-2"
                />
                <button onClick={handleLogin} className="btn btn-primary w-100">
                  Login
                </button>
              </>
            ) : (
              <div>
                <h2>Register</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control mb-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mb-2"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mb-2"
                />
                <button onClick={handleRegister} className="btn btn-success w-100">
                  Register
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <h2>Welcome, {user.name}!</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout} className="btn btn-danger w-100">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
