import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Lottie from "lottie-react";
import register from "../register.json";
import Deshboard from '../src/Deshboard'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

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

    if (!name.trim()) {
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
      await axios.post(`${API_BASE_URL}/extensionuser/register`, {
        name,
        email,
        password,
      });

      alert("Registered successfully. Now you can log in.");
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="text-center border p-4 rounded shadow bg-light" style={{ width: "350px", maxWidth: "90%" }}>
        <div className="d-flex justify-content-center align-items-center">
          <Lottie animationData={register} className="w-25 mx-2"></Lottie>
          <h2>Register</h2>
        </div>
        <br />
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
          disabled={!isFormValid}
        >
          Register
        </button>
        <h5 className="mt-3">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-primary pointer">
            Login
          </span>
        </h5>
      </div>
    </div>
  );
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    validateInputs();
  }, [email, password]);

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
    }

    if (onSubmit || Object.keys(touched).length > 0) {
      setErrors(newErrors);
    }

    setIsFormValid(isValid);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    validateInputs(true);

    if (!isFormValid) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/extensionuser/login`, {
        email,
        password,
      });

      alert("Login successful");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="text-center border p-4 rounded shadow bg-light" style={{ width: "350px", maxWidth: "90%" }}>
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
          disabled={!isFormValid}
        >
          Login
        </button>
        <h5 className="mt-3">
          Don't have an account?{" "}
          <span onClick={() => navigate("/")} className="text-primary pointer">
            Register
          </span>
        </h5>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Deshboard></Deshboard>}></Route>
        
      </Routes>
    </Router>
  );
}

export default App;
