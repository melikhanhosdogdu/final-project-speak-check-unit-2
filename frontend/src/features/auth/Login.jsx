import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import loginPic from "../../assets/login.jpg";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../shared/api/api";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await authAPI.login({
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast("Login successful!", {
        type: "success",
        position: "bottom-right",
      });
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      toast(error.response?.data?.message || "Login failed", {
        type: "error",
        position: "bottom-right",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="left-container">
        <img src={loginPic} alt="Login" />
      </div>
      <div className="right-container">
        <div className="login-form-container">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <Input
              label="Email"
              type="email"
              register={register("email")}
              error={errors.email}
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              type="password"
              register={register("password")}
              error={errors.password}
              placeholder="Enter your password"
            />
            <Button type="submit" isLoading={isLoading}>
              Login
            </Button>
            <div className="form-links">
              <Link to="/signup" className="form-link">
                Sign Up
              </Link>
              {/* <Link to="/forgot-password" className="form-link">
                Forgot Password?
              </Link> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
