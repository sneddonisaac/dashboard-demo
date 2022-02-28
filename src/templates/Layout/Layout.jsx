import React, { useState, useEffect } from "react";
import { SearchIcon, LogoutIcon } from "@heroicons/react/outline";
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
            <h1>{!username ? "Welcome" : `Welcome, ${username}`}</h1>
          </div>

          <div className="app__layout-topbar-searchbar">
            <input placeholder="Search" className="searchbar__input" />
            <button className="searchbar__btn">
              <SearchIcon className="btn-icon" />
            </button>
          </div>
        </div>
        <div className="app__layout-component-wrapper">
          <div className="app__layout-component">
            <Component />
          </div>
        </div>
      </div>
    );
  };

export default Layout;
