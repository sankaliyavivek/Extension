import { useEffect, useState } from "react";
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Lottie from "lottie-react";
import register from "../register.json";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedIsRegistered = localStorage.getItem("isRegistered") === "true";

    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }

    setIsRegistered(storedIsRegistered);
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

    if (!isRegistered && !name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
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
    try {
      await axios.post(`${API_BASE_URL}/extensionuser/register`, { name, email, password });
      alert("Registered successfully. Now you can log in.");
      setIsRegistered(true);
      localStorage.setItem("isRegistered", "true");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    validateInputs(true);
    if (!isFormValid) return;
    try {
      const { data } = await axios.post(`${API_BASE_URL}/extensionuser/login`, { email, password });
      setUser(data);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user"); // Only remove the user, keep isRegistered
    setEmail("");
    setPassword("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center border p-4 rounded shadow bg-light" style={{ width: "350px", maxWidth: "90%" }}>
        {!isLoggedIn ? (
          <div>
            {isRegistered ? (
              <>
                <h2>Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control mb-2" />
                {errors.email && <p className="text-danger">{errors.email}</p>}
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control mb-2" />
                {errors.password && <p className="text-danger">{errors.password}</p>}
                <button onClick={handleLogin} className="btn btn-primary w-100" disabled={!isFormValid}>Login</button>
                <p className="mt-3">
                  Don't have an account?{" "}
                  <button className="btn btn-link p-0" onClick={() => setIsRegistered(false)}>Register</button>
                </p>
              </>
            ) : (
              <>
                <div className="d-flex justify-content-center align-items-center">
                  <Lottie animationData={register} className="w-25 mx-2"></Lottie>
                  <h2>Register</h2>
                </div>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="form-control mb-2" />
                {errors.name && <p className="text-danger">{errors.name}</p>}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control mb-2" />
                {errors.email && <p className="text-danger">{errors.email}</p>}
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control mb-2" />
                {errors.password && <p className="text-danger">{errors.password}</p>}
                <button onClick={handleRegister} className="btn btn-success w-100" disabled={!isFormValid}>Register</button>
                <p className="mt-3">
                  Already have an account?{" "}
                  <button className="btn btn-link p-0" onClick={() => setIsRegistered(true)}>Login</button>
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <h2>Welcome, {user.name}!</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout} className="btn btn-danger w-100">Logout</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
