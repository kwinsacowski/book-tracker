import { APP_NAME, THEME } from "@/config/app";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegistrationPage() {
    return (
         <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.badge}>Create your account</div>

        <h1 className={styles.title}>Start your shelf</h1>
        <p className={styles.subtitle}>
          Join Inkling Shelf and begin building your personal reading space.
        </p>

        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className={styles.input}
            />
          </div>

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
              placeholder="Create a password"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.primaryButton}>
            Create Account
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}