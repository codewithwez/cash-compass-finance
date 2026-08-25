import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useStudentStore } from "@/store/useStudentStore";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useGoogleLogin } from "@react-oauth/google";

// Zod validation schema
const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["Student", "Employee"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const navigate = useNavigate();
  const registerUser = useStudentStore((state) => state.registerUser);
  const googleAuth = useStudentStore((state) => state.googleAuth);
  const setEmployeeUser = useEmployeeStore((state) => state.setUser);

  // States for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Student",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch the selected role so Google Sign Up assigns the correct dashboard route
  const selectedRole = watch("role");

  const routeAfterSignup = (user) => {
    if (user.role === "Employee") {
      setEmployeeUser(user);
      navigate("/employee-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  // Standard Form Submission
  const onSubmit = async (data) => {
    const auth = await registerUser({
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
      monthlyAllowance: 0,
    });

    routeAfterSignup(auth.user);
  };

  // Google OAuth Hook Integration
  const handleGoogleSignUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user details from Google UserInfo API using access_token
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();

        console.log("Google User Authenticated:", googleUser);

        const auth = await googleAuth({
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          role: selectedRole,
          googleId: googleUser.sub,
        });

        routeAfterSignup(auth.user);
      } catch (err) {
        console.error("Failed to fetch Google profile info:", err);
      }
    },
    onError: (error) => console.error("Google Sign Up Failed:", error),
  });

  return (
    <div className="relative h-screen w-full bg-[#f5f5fe] dark:bg-[#09090b] flex flex-col items-center justify-center p-4 overflow-hidden transition-colors">
      
      {/* Top Left Back Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </button>

      {/* Top Header: Rounded Logo Emblem */}
      <div className="flex flex-col items-center mb-3 text-center select-none">
        <div
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-200/60 dark:border-indigo-500/30 shadow-sm mb-1.5 cursor-pointer overflow-hidden transition-transform hover:scale-105"
        >
          <img
            src="/logofnl.png"
            alt="CashCompass Emblem"
            className="w-[85%] h-[85%] object-contain drop-shadow-sm"
          />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create an account
        </h1>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
          Start tracking your finances with CashCompass
        </p>
      </div>

      {/* Main SignUp Card */}
      <div className="w-full max-w-sm bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-sm p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
          
          {/* Row 1: Full Name & Account Role */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              />
              {errors.name && (
                <p className="mt-0.5 text-[10px] text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                Account Role
              </label>
              <select
                {...register("role")}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="Student">Student</option>
                <option value="Employee">Employee (Salaried)</option>
              </select>
              {errors.role && (
                <p className="mt-0.5 text-[10px] text-red-500">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              {...register("email")}
              className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-400 dark:placeholder:text-zinc-600"
            />
            {errors.email && (
              <p className="mt-0.5 text-[10px] text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Row 2: Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-0.5 text-[10px] text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                Confirm
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-0.5 text-[10px] text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-xs shadow-sm transition duration-200 disabled:opacity-50 mt-1 cursor-pointer"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white dark:bg-[#121215] px-2 text-slate-400 dark:text-zinc-500 font-medium">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={() => handleGoogleSignUp()}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 text-slate-700 dark:text-zinc-200 font-medium py-1.5 px-4 rounded-lg text-xs shadow-sm transition duration-200 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>
      </div>

      {/* Footer Link */}
      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-3 text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
