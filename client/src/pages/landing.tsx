import React, { FormEvent, useState } from "react";
import { useLocation } from "wouter";
import { setAuthenticated } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleYearClick = () => {
    if (showPasswordField) {
      return;
    }

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 5) {
      setShowPasswordField(true);
      setClickCount(0);
      setError("");
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await apiRequest("POST", "/api/auth", { password: password.trim() });
      setAuthenticated(true);
      setLocation("/dashboard");
    } catch (requestError) {
      console.error("Dashboard auth failed:", requestError);
      setError("Invalid password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black">
      <iframe
        title="Closo Landing"
        src="/xtract/xtract.framer.ai/index.html"
        className="block h-screen w-full border-0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
      />

      <footer className="border-t border-white/10 bg-black/95 px-4 py-3 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm" data-testid="text-footer-copyright">
            Copyright{" "}
            <button
              type="button"
              onClick={handleYearClick}
              className="font-semibold text-white hover:text-slate-200"
              data-testid="text-footer-year"
            >
              2026
            </button>{" "}
            Closo, Inc. All rights reserved.
          </p>

          {showPasswordField ? (
            <form onSubmit={handleLogin} className="flex items-center gap-2">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter dashboard password"
                autoFocus
                className="h-9 w-56 rounded border border-slate-600 bg-slate-900 px-3 text-sm text-white placeholder:text-slate-400 focus:border-white focus:outline-none"
                data-testid="input-footer-password"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="h-9 rounded bg-white px-3 text-sm font-medium text-black hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                data-testid="button-footer-login"
              >
                {isLoading ? "Checking..." : "Login"}
              </button>
            </form>
          ) : null}
        </div>

        {showPasswordField && error ? (
          <p className="mx-auto mt-2 max-w-7xl text-xs text-red-400" data-testid="text-footer-login-error">
            {error}
          </p>
        ) : null}
      </footer>
    </div>
  );
}
