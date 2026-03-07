import { APP_NAME, THEME } from "@/config/app";

export default function LibraryPage() {
    return (
        <main
            style={{
            minHeight: "100vh",
            backgroundColor: THEME.colors.parchment,
            color: THEME.colors.oldLibrary,
            padding: "2rem",
        }}>
            <h1 style={{ color: THEME.colors.forestInk }}>Library</h1>
            <p>Library Page Placeholder</p>
        </main>
    )
}