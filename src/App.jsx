import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

import "./App.scss";

// UI Component Imports
import AppRouter from "./components/atoms/AppRouter/AppRouter";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <div>{!session ? <Auth /> : <AppRouter session={session} />}</div>;
}

export default App;
