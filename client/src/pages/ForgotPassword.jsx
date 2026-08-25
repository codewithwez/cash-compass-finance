import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/api/client";
import {
  forgotPasswordSchema,
  getValidationMessage,
} from "@/lib/validationSchemas";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const validation = forgotPasswordSchema.safeParse({ email });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to send the reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f5f5fe] p-4 dark:bg-[#09090b]">
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="absolute left-4 top-4 flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back 
      </button>

      <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#121215]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Forgot password
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            {message
              ? "Check your inbox for a link to reset your password. It expires in 1 hour."
              : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        {message ? (
          <p className="text-center text-xs text-emerald-600">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
