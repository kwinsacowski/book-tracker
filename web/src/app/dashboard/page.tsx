import Link from "next/link";
import { APP_NAME, THEME } from "@/config/app";

export default function DashboardPage() {
    return (
        <main style={{
            display: 'flex', 
            minHeight: '100vh',
            backgroundColor: THEME.colors.parchment,
            color: THEME.colors.oldLibrary,
        }}>
            <aside
                style={{
                    width: '240px',
                    backgroundColor: THEME.colors.mossGreen,
                    color: THEME.colors.parchment,
                    borderRight: `1px solid ${THEME.colors.antiqueGold}`,
                    padding: '1.5rem 1rem',
                }}
            >
                <h2
                    style={{
                        marginTop: 0,
                        marginBottom: "1.5rem",
                        color: THEME.colors.antiqueGold,
                    }}
                >
                    {APP_NAME}
                </h2>

                <nav>
                    <ul style={{listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.2'}}>
                        <li>
                            <Link href="/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/library">Library</Link>
                        </li>
                        <li>
                            <Link href="/login">Login</Link>
                        </li>
                        <li>
                            <Link href="/register">Register</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <section style={{ flex: 1, padding: '2rem' }}>
                <h1 style={{ color: THEME.colors.forestInk }}>Dashboard</h1>
                <p>Welcome back to {APP_NAME}!</p>
                <p>This is your dashboard where you can track your reading progress and manage your book collection.</p>
            </section>
        </main>
    )
}