import { useState } from "react";
import { motion } from "framer-motion";
import { TrainFront } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = email.includes("@") && password.length >= 6;
  const isDisabled = !email.trim() || !password.trim() || loading;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Enter a valid email and password (min 6 characters).");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    onLogin();
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 px-4 py-8">
      <img
        src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80"
        alt="Modern passenger train"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/50 via-green-200/35 to-blue-500/35" />
      <div className="absolute inset-0 bg-black/25" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl backdrop-blur-md"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-xl bg-blue-500 p-2 text-white shadow">
            <TrainFront className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Railway Routing System</h2>
            <p className="text-sm text-slate-500">Sign in to access your dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-green-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-300"
              placeholder="******"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {loading ? "Signing in..." : "Login"}
          </button>
          {!isFormValid && !error && (
            <p className="text-xs text-slate-500">
              Use a valid email and password of at least 6 characters.
            </p>
          )}
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Secure local session for demo mode.
        </p>
      </motion.div>
    </div>
  );
}
