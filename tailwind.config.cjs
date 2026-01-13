/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#f82d97",
                secondary: "#2dd4bf",
                accent: "#8b5cf6",
                background: "#050505",
                surface: "rgba(255, 255, 255, 0.05)",
                border: "rgba(255, 255, 255, 0.1)",
                success: "#22c55e",
                warning: "#f59e0b",
                error: "#ef4444",
                "text-muted": "#a1a1aa",
                text: "#ffffff",
            },
        },
    },
    plugins: [],
}
