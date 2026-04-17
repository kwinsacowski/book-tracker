"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, setStoredUser, setToken } from "../../lib/auth";
import styles from "../../styles/register.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      router.push("/");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!API_URL) {
      setError("NEXT_PUBLIC_API_URL is missing.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Login failed.");
      }

      setToken(data.access_token);

      const existingUser = getStoredUser();

      setStoredUser({
        id: data.user?.id ?? existingUser?.id,
        email: data.user?.email ?? email,
        name: data.user?.name,
      });

      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.badge}>Welcome back</div>

        <h1 className={styles.title}>Log in to your shelf</h1>
        <p className={styles.subtitle}>
          Sign in to view your dashboard, library, and reading progress.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className={styles.footerText}>
          Need an account?{" "}
          <Link href="/register" className={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}