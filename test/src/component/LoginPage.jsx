import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const credentials =
      currState === "Sign up"
        ? { name: fullName, email, password } // <-- gửi name, không fullName
        : { email, password };

    const result = await login(
      currState === "Sign up" ? "signup" : "login",
      credentials
    );

    if (result.success) {
      navigate("/users"); // Điều hướng sang trang danh sách người dùng
    } else {
      alert(result.message);
    }
  };

  const toggleState = () => {
    setCurrState(currState === "Sign up" ? "Login" : "Sign up");
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <form onSubmit={onSubmitHandler} className="login-form">
        <h1 className="form-title">{currState}</h1>

        {currState === "Sign up" && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="form-input"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />

        <button type="submit" className="form-button">
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="switch-text">
          {currState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span onClick={toggleState} className="switch-link">
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account?{" "}
              <span onClick={toggleState} className="switch-link">
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
