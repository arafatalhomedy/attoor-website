import { createContext, useContext, useEffect, useState } from "react";

const AdminThemeContext = createContext(null);

export function AdminThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("admin-theme") || "light"
    );

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("admin-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </AdminThemeContext.Provider>
    );
}

export function useAdminTheme() {
    return useContext(AdminThemeContext);
}