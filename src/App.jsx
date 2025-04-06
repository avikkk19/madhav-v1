import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./components/SupabaseClient.jsx";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import HeroSection from "./components/HeroSection.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the current session
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchSession();

    // Listen for session changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <Routes>
      {/* Redirect signed-in users away from /signin and /signup */}
      <Route
        path="/signin"
        element={user ? <Navigate to="/" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <SignUp />}
      />

      {/* Protect the home route */}
      <Route
        path="/"
        element={user ? <HeroSection /> : <Navigate to="/signin" replace />}
      />
    </Routes>
  );
}

export default App;
