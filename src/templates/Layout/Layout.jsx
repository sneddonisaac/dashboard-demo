import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

import "./Layout.scss";

const Layout = (Component) =>
  function HOC() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [session, setSession] = useState(null);

    useEffect(() => {
      setSession(supabase.auth.session());

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    }, []);

    useEffect(() => {
      getProfile();
    }, [session]);

    async function getProfile() {
      try {
        setLoading(true);
        const user = supabase.auth.user();

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username`)
          .eq("id", user?.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="app__layout">
        <div className="app__layout-topbar">
          <div>
            <h3>{!username ? "Welcome" : `Welcome, ${username}`}</h3>
          </div>
        </div>
        <div className="app__layout-component-wrapper">
          <Component />
        </div>
      </div>
    );
  };

export default Layout;
