import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;
const AUTH_GATEWAY_URL = import.meta.env.VITE_AUTH_GATEWAY_URL;

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${AUTH_GATEWAY_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || "Invalid email or password.");
                setLoading(false);
                return;
            }

            // Hand the tokens off to Supabase's own client so ProtectedRoute
            // and everything else downstream keeps working exactly as before.
            const { error: sessionError } = await supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
            });

            setLoading(false);

            if (sessionError) {
                setError("Login succeeded but session setup failed. Try again.");
                return;
            }

            navigate(`/${ADMIN_PATH}`);
        } catch (err) {
            setLoading(false);
            setError("Could not reach the login service. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-charcoal mb-1">Admin Login</h1>
                <p className="text-sm text-zinc-500 mb-6">Attoor.CEGS content management</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-gold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-gold"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold hover:opacity-90 text-charcoal font-semibold py-2 rounded-md transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}