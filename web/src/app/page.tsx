import Image from "next/image";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE, THEME } from "@/config/app";

export default function HomePage() {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: THEME.colors.parchment,
        color: THEME.colors.oldLibrary,
        padding: '2rem'}}>
        
        <Image 
          src="/assets/inkling-shelf-logo.png"
          alt="Inkling Shelf Logo"
          width={180}
          height={180}
          style={{ marginBottom: '1rem' }}
        />
        
        <h1 style={{
          color: THEME.colors.forestInk,
          marginBottom: '0.5rem',
        }}>
          Welcome to {APP_NAME}
          </h1>

          
        <p style={{ marginBottom: "0.5rem" }}>{APP_TAGLINE}</p>
        <p style={{ marginBottom: "2rem" }}>Track your reading progress and manage your book collection.</p>
        
        <ul style={{ lineHeight: '2'}}>
          <li>
            <Link href="/dashboard">Go to Dashboard</Link>
          </li>
          <li>
            <Link href="/library">View Library</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
        </ul>
      </main>
    )
}