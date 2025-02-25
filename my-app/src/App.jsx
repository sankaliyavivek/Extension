import { useEffect, useState } from "react";
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Lottie from 'lottie-react';
import register from '../register.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    validateInputs();
  }, [name, email, password]);

  const validateInputs = (onSubmit = false) => {
    let newErrors = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!isRegistered) {
      if (!name.trim()) {
        newErrors.name = "Name is required";
        isValid = false;
      }
    }

    if (onSubmit || Object.keys(touched).length > 0) {
      setErrors(newErrors);
    }

    setIsFormValid(isValid);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    validateInputs(true);

    if (!isFormValid) return;

    setLoading(true); // Start loading
    try {
      await axios.post(`${API_BASE_URL}/extensionuser/register`, {
        name,
        email,
        password,
      });

      alert("Registered successfully. Now you can log in.");
      setIsRegistered(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${API_BASE_URL}/extensionuser/login`,
        { email, password },
        { withCredentials: true }
      );

      alert("Login successful");
      setUser(response.data.user);
      setIsLoggedIn(true);
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleBack = () => {
    setIsRegistered(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsRegistered(false);
    localStorage.removeItem("user");
    setEmail('');
    setPassword('');
  };

  const handleLoginPage = () => {
    setIsRegistered(true);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="text-center border p-4 rounded shadow bg-light" style={{ width: "350px", maxWidth: "90%" }}>
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
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className="form-control mb-2"
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className="form-control mb-2"
                />
                {errors.password && <p className="text-danger">{errors.password}</p>}
                <button
                  onClick={handleLogin}
                  className="btn btn-primary w-100"
                  disabled={!isFormValid || loading} // Disable when loading
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <br /><br />
                <div className="w-100 text-center btn btn-primary" onClick={handleBack}>
                  <span>Back</span>
                </div>
              </>
            ) : (
              <div>
                <div className="d-flex justify-content-center align-items-center">
                  <Lottie animationData={register} className="w-25"></Lottie>
                  <h2>Register</h2>
                </div>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  className="form-control mb-2"
                />
                {errors.name && <p className="text-danger">{errors.name}</p>}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className="form-control mb-2"
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className="form-control mb-2"
                />
                {errors.password && <p className="text-danger">{errors.password}</p>}
                <button
                  onClick={handleRegister}
                  className="btn btn-success w-100"
                  disabled={!isFormValid || loading}
                >
                  {loading ? "Registering..." : "Register"} {/* Show loading text */}
                </button>

                <br /><br />
                <span>
                  Already have an account?<span onClick={handleLoginPage} className="loginbtn">
                    Login
                  </span>
                </span>
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
