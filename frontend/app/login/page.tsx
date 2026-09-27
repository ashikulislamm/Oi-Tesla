"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Heading,
  Input,
  StatusDot,
} from "../../components/ui";
import { authStorage, fetchApi, AuthResponse } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const res = await fetchApi<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setIsLoading(false);

    if (!res.success || !res.data) {
      setErrorMessage(res.message || "Invalid credentials");
      return;
    }

    authStorage.setToken(res.data.token);
    authStorage.setUser(res.data.user);

    // Redirect to home/app
    router.push("/");
  };

  const handleQuickFill = (fillEmail: string) => {
    setEmail(fillEmail);
    setPassword("TeslaPassword123!");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--mist-sage)] text-[var(--ink)]">
      {/* Top Header */}
      <header className="border-b border-[var(--line)] px-6 py-4 bg-[var(--mist-sage)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--deep-harbor)] tracking-tight"
          >
            Oi Tesla
          </Link>
          <StatusDot status="info" label="Commuter Sign In" />
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card surface="raised" padding="lg">
            <Heading
              level="1"
              subtitle="Access your commuter or driver dashboard"
              className="mb-6"
            >
              Sign in to Oi Tesla
            </Heading>

            {errorMessage && (
              <div className="p-3 mb-6 border border-[var(--status-error)]/30 bg-red-50/50 rounded-[var(--radius-control)] text-xs text-[var(--status-error)] font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email address"
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@oitesla.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="accent"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="mt-2"
              >
                Sign in
              </Button>
            </form>

            {/* Quick-fill Cast Helpers for Testing & Demo */}
            <div className="mt-8 pt-6 border-t border-[var(--line)]">
              <span className="text-xs font-semibold text-[var(--ink-muted)] block mb-3">
                Demo Cast Quick Select
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickFill("nusrat@oitesla.com")}
                >
                  Nusrat (Passenger)
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickFill("jashim@oitesla.com")}
                >
                  Jashim (Driver)
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-[var(--ink-muted)]">
              Don't have an account yet?{" "}
              <Link
                href="/register"
                className="text-[var(--deep-harbor)] font-semibold hover:underline"
              >
                Create account
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
