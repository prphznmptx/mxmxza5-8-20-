import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Crown, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "sent">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Add API call to send password reset email
      // For now, just show the sent screen after a brief delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStep("sent");
    } catch (error) {
      setErrors({
        submit: "Failed to send reset email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col items-center overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-[clamp(0.5rem,2dvh,1rem)] sm:px-6 lg:px-8">
      <div className="mx-auto my-auto w-full max-w-md rounded-lg bg-card p-[clamp(1rem,4dvh,2rem)] text-card-foreground shadow-lg">
        {/* Header */}
        <div className="text-center mb-[clamp(1rem,4dvh,2rem)]">
          <div className="flex items-center justify-center mb-[clamp(0.5rem,2dvh,1rem)]">
            <Crown className="w-8 h-8 text-sheraton-gold" />
          </div>
          <h1 className="text-[clamp(1.5rem,4dvh,1.875rem)] font-bold text-sheraton-navy mb-[clamp(0.25rem,1dvh,0.5rem)]">
            Reset Password
          </h1>
          <p className="text-muted-foreground">
            {step === "email"
              ? "Enter your email to receive password reset instructions"
              : "Check your email for further instructions"}
          </p>
        </div>

        {step === "email" ? (
          <>
            {/* Error Messages */}
            {errors.submit && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
                <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
              </div>
            )}

            {/* Reset Form */}
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
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sheraton-gold hover:bg-sheraton-gold/90 text-white font-semibold py-3 rounded-md transition"
              >
                {isLoading ? "Sending..." : "Send Reset Email"}
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-[clamp(0.75rem,3dvh,1.5rem)]">
              <Link
                to="/login"
                className="flex items-center justify-center text-foreground transition hover:text-sheraton-gold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="text-center space-y-[clamp(1rem,3dvh,1.5rem)]">
              <div className="flex justify-center">
                <CheckCircle className="h-[clamp(2.5rem,8dvh,4rem)] w-[clamp(2.5rem,8dvh,4rem)] text-green-500" />
              </div>

              <div className="space-y-[clamp(0.5rem,1dvh,0.75rem)]">
                <p className="text-muted-foreground">
                  We've sent password reset instructions to:
                </p>
                <p className="font-semibold text-foreground">{email}</p>
              </div>

              <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  Please check your email (including spam folder) for a link to
                  reset your password. The link will expire in 24 hours.
                </p>
              </div>

              <div className="space-y-[clamp(0.5rem,1.5dvh,0.75rem)]">
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-sheraton-gold hover:bg-sheraton-gold/90 text-white font-semibold py-3 rounded-md transition"
                >
                  Back to Login
                </Button>

                <button
                  onClick={() => {
                    setStep("email");
                    setEmail("");
                  }}
                  className="w-full text-foreground font-medium transition hover:text-sheraton-gold"
                >
                  Try a different email
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
