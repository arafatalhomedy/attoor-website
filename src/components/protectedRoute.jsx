import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(undefined);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    if (session === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <p className="text-zinc-500">Loading...</p>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/" replace />;
    }

    return children;
}