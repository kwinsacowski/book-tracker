import { APP_NAME, THEME } from "@/config/app";

export default function RegistrationPage() {
    return (
        <main
            style={{
            minHeight: "100vh",
            backgroundColor: THEME.colors.parchment,
            color: THEME.colors.oldLibrary,
            padding: "2rem",
        }}>
            <h1 style={{ color: THEME.colors.forestInk }}>Register</h1>
            <p>Registration Form Placeholder</p>
        </main>
    )
}