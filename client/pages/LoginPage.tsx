import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Crown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { supabase } from "../lib/supabase";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedReturnTo = searchParams.get("returnTo");
  const returnTo = requestedReturnTo?.startsWith("/") && !requestedReturnTo.startsWith("//") ? requestedReturnTo : "/profile";
  const registerPath = returnTo === "/profile" ? "/register" : `/register?returnTo=${encodeURIComponent(returnTo)}`;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrors({
          submit: error.message || "Login failed. Please try again.",
        });
        return;
      }

      if (!data.user) {
        setErrors({
          submit: "Failed to log in. Please try again.",
        });
        return;
      }

      navigate(returnTo, { replace: true });
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col items-center overflow-y-auto bg-sheraton-cream px-4 py-[clamp(0.5rem,2dvh,1rem)] sm:px-6 lg:px-8">
      <div className="mx-auto my-auto w-full max-w-md rounded-lg bg-card text-card-foreground shadow-lg p-[clamp(1rem,4dvh,2rem)]">
        {/* Header */}
        <div className="text-center mb-[clamp(1rem,4dvh,2rem)]">
          <div className="flex items-center justify-center mb-[clamp(0.5rem,2dvh,1rem)]">
            <Crown className="w-8 h-8 text-sheraton-gold" />
          </div>
          <h1 className="text-[clamp(1.5rem,4dvh,1.875rem)] font-bold text-sheraton-navy mb-[clamp(0.25rem,1dvh,0.5rem)]">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Sign in to your Sheraton account</p>
        </div>

        {/* Error Messages */}
        {errors.submit && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
            <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-[clamp(1rem,3dvh,1.5rem)]">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-[clamp(0.25rem,1dvh,0.5rem)]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-[clamp(0.25rem,1dvh,0.5rem)]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-sheraton-gold hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sheraton-gold hover:bg-sheraton-gold/90 text-white font-semibold py-3 rounded-md transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-[clamp(0.75rem,3dvh,1.5rem)] text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to={registerPath}
              className="font-semibold text-foreground hover:underline"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
