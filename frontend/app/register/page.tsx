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

type RoleTab = "passenger" | "driver";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<RoleTab>("passenger");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plateOrName, setPlateOrName] = useState("Bullet (Tesla Model 3)");
  const [capacity, setCapacity] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const endpoint =
      role === "passenger"
        ? "/api/auth/passenger/signup"
        : "/api/auth/driver/signup";

    const payload =
      role === "passenger"
        ? { name, email, password }
        : { name, email, password, plateOrName, capacity: Number(capacity) };

    const res = await fetchApi<AuthResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setIsLoading(false);

    if (!res.success || !res.data) {
      setErrorMessage(res.message || "Registration failed");
      return;
    }

    authStorage.setToken(res.data.token);
    authStorage.setUser(res.data.user);

    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--mist-sage)] text-[var(--ink)]">
      {/* Header */}
      <header className="border-b border-[var(--line)] px-6 py-4 bg-[var(--mist-sage)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--deep-harbor)] tracking-tight"
          >
            Oi Tesla
          </Link>
          <StatusDot status="info" label="Create Commuter Account" />
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card surface="raised" padding="lg">
            <Heading
              level="1"
              subtitle="Register as a commuter or EV fleet driver"
              className="mb-6"
            >
              Get started with Oi Tesla
            </Heading>

            {/* Role Switcher Tabs */}
            <div className="flex border border-[var(--line)] rounded-[var(--radius-control)] p-1 bg-[var(--mist-sage)] mb-6">
              <button
                type="button"
                onClick={() => setRole("passenger")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-[var(--radius-control)] transition-all cursor-pointer ${
                  role === "passenger"
                    ? "bg-[var(--deep-harbor)] text-white"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                Passenger
              </button>
              <button
                type="button"
                onClick={() => setRole("driver")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-[var(--radius-control)] transition-all cursor-pointer ${
                  role === "driver"
                    ? "bg-[var(--deep-harbor)] text-white"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                Driver & Tesla
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 mb-6 border border-[var(--status-error)]/30 bg-red-50/50 rounded-[var(--radius-control)] text-xs text-[var(--status-error)] font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Full name"
                id="reg-name"
                required
                placeholder="e.g. Nusrat Jahan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email address"
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@oitesla.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                id="reg-password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {role === "driver" && (
                <>
                  <Input
                    label="Tesla vehicle model & plate"
                    id="reg-plate"
                    required
                    placeholder="e.g. Bullet (Tesla Model 3)"
                    value={plateOrName}
                    onChange={(e) => setPlateOrName(e.target.value)}
                  />

                  <Input
                    label="Passenger seat capacity"
                    id="reg-capacity"
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    helperText="Bullet capacity is fixed to 3 seats"
                  />
                </>
              )}

              <Button
                type="submit"
                variant="accent"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="mt-2"
              >
                Create {role === "passenger" ? "passenger" : "driver"} account
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-[var(--ink-muted)]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--deep-harbor)] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
