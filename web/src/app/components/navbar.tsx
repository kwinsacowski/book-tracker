import Link from "next/link";
import { APP_NAME, THEME } from "@/config/app";

export default function NavBar() {
    return (
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
                            <Link href="/">Dashboard</Link>
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
    )
}