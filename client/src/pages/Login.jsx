import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useStudentStore } from "@/store/useStudentStore";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useAdminStore } from "@/store/useAdminStore";
import { useGoogleLogin } from "@react-oauth/google";

// Simplified Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const navigate = useNavigate();
  const login = useStudentStore((state) => state.login);
  const googleAuth = useStudentStore((state) => state.googleAuth);
  const setEmployeeUser = useEmployeeStore((state) => state.setUser);
  const setAdminAuthenticated = useAdminStore(
    (state) => state.setAdminAuthenticated
  );
  const fetchAdminData = useAdminStore((state) => state.fetchAdminData);

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const routeAuthenticatedUser = async (user) => {
    if (user.role === "Admin") {
      setAdminAuthenticated(true);
      await fetchAdminData();
      navigate("/admin-dashboard");
      return;
    }

    if (user.role === "Employee") {
      setEmployeeUser(user);
      navigate("/employee-dashboard");
      return;
    }

    navigate("/dashboard");
  };

  // Standard Form Submission
  const onSubmit = async (data) => {
    try {
      const auth = await login(data);
      await routeAuthenticatedUser(auth.user);
    } catch (error) {
      setError("password", {
        type: "manual",
        message: error.message || "Unable to sign in.",
      });
    }
  };

  // Google OAuth Login Trigger
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user information from Google API
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        const googleUser = await res.json();
        console.log("Google Login User Info:", googleUser);

        const auth = await googleAuth({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          role: "Student",
          googleId: googleUser.sub,
        });

        await routeAuthenticatedUser(auth.user);
      } catch (error) {
        console.error("Failed to fetch Google profile info:", error);
      }
    },
    onError: (error) => console.error("Google Login Failed:", error),
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
          Welcome back
        </h1>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
          Sign in to your CashCompass account
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-sm bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-sm p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          
          {/* Email Field */}
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
              <p className="mt-0.5 text-[10px] text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field with Eye Toggle */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg pl-3 pr-10 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-0.5 text-[10px] text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-xs shadow-sm transition duration-200 disabled:opacity-50 mt-1 cursor-pointer"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-3.5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white dark:bg-[#121215] px-2 text-slate-400 dark:text-zinc-500 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
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
      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-3.5 text-center">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
        >
          Sign up for free
        </button>
      </p>
    </div>
  );
}

export default Login;
