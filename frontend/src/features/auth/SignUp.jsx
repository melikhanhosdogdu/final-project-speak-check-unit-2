import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import signupPic from "../../assets/signup.jpg";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./SignUp.css";
import { authAPI } from "../../shared/api/api";
import { toast } from "react-toastify";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await authAPI.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast("Registration successful!.", {
        type: "success",
        position: "bottom-right",
      });
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      toast(error.response?.data?.message || "Registration failed", {
        type: "error",
        position: "bottom-right",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="left-container">
        <img src={signupPic} alt="Sign Up" />
      </div>
      <div className="right-container">
        <div className="signup-form-container">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
            <Input
              label="Username"
              type="text"
              register={register("username")}
              error={errors.username}
              placeholder="Enter your username"
            />
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
              Sign Up
            </Button>
            <div className="form-links">
              <Link to="/login" className="form-link">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
