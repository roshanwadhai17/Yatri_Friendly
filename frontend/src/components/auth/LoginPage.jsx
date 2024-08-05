import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../service/UserService";
import AuthContext from "../common/AuthContext";
import "./Login.css";

const LoginPage = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    if (!userID) newErrors.userID = "UserID or Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userData = await UserService.login(userID, password);
        if (userData.token) {
          localStorage.setItem("token", userData.token);
          localStorage.setItem("role", userData.role);
          toast.success("Login successful!");
          setIsLoggedIn(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          if (userData.message === "User not found") {
            setErrors({ userID: "User not found", password: "" });
          } else if (userData.message === "Incorrect credentials") {
            setErrors({ password: "Incorrect credentials", userID: "" });
          } else {
            setErrors({ message: userData.message });
          }
        }
      } catch (error) {
        setErrors({ message: "Failed to login. Please try again." });
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h1 className="heading">LOGIN</h1>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter UserID or Email"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            className="input"
          />
          {errors.userID && <span className="error">{errors.userID}</span>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit" className="button">
          Submit
        </button>
        {errors.message && <span className="error">{errors.message}</span>}
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
