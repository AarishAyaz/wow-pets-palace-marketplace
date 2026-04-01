import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleOneTap() {
  const { isAuthenticated, setUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // ❌ Don't show on auth pages
    if (isAuthenticated) return;
    if (location.pathname === "/login" || location.pathname === "/signup") return;

    const initializeGoogle = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt();
    };

    const handleCredentialResponse = async (response: any) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/authUser/auth/google`,
          { token: response.credential },
          { headers: { "Content-Type": "application/json" } }
        );

        const userData = res.data?.data;

        localStorage.setItem("token", userData.auth_token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

      } catch (err) {
        console.error("Google Sign-In Failed", err);
      }
    };

    // Load script if not present
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }

  }, [isAuthenticated, location.pathname]);

  return null;
}