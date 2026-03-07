import { APP_NAME, THEME } from "@/config/app";

export default function LoginPage() {
    return (
        <main
            style={{
            minHeight: "100vh",
            backgroundColor: THEME.colors.parchment,
            color: THEME.colors.oldLibrary,
            padding: "2rem",
        }}>
            <h1 style={{ color: THEME.colors.forestInk }}>Login</h1>
            <p>Login Form Placeholder</p>
        </main>
    )
}