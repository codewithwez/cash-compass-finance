import { useState } from "react";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "@/api/client";
import {
  getValidationMessage,
  resetPasswordSchema,
} from "@/lib/validationSchemas";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("This password reset link is invalid or has expired.");
      return;
    }

    const validation = resetPasswordSchema.safeParse({
      password,
      confirmation,
    });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setMessage(response.message);
      setPassword("");
      setConfirmation("");
    } catch (requestError) {
      setError(requestError.message || "Unable to reset your password.");
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
        Back to login
      </button>

      <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#121215]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create a new password
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            Choose a new password for your CashCompass account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-zinc-300">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              minLength={6}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          {message && (
            <div className="space-y-2 text-xs text-emerald-600">
              <p>{message}</p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold hover:underline"
              >
                Return to login
              </button>
            </div>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || Boolean(message)}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
