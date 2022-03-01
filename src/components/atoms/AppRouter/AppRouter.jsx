import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { DashboardIcon, ExitIcon, PersonIcon, RocketIcon } from '@radix-ui/react-icons'

import { supabase } from "../../../supabaseClient";
import "./AppRouter.scss";
import Overview from "../../organisms/Dashboard/Dashboard";
import Games from "../../organisms/Games/Games";
import Account from "../../molecules/Account/Account";
import Game from "../../organisms/Games/Game/Game";
import GameOverview from "../../organisms/Games/Game/GameOverview/GameOverview";
import Screenshots from "../../organisms/Games/Game/Screenshots/Screenshots";

function AppRouter({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Router>
      <div className="app__router">
        <SideNav url={avatar_url} session={session} />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="account" element={<Account session={session} />} />
          <Route path="games" element={<Games />} />
          <Route path="games/:gameId" element={<Game />}>
            <Route path="" element={<GameOverview />} />
            <Route path="screenshots" element={<Screenshots />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

const links = [
  {
    id: "01",
    name: "Dashboard",
    icon: DashboardIcon,
    href: "/",
  },
  {
    id: "02",
    name: "Games",
    icon: RocketIcon,
    href: "/games",
  },
];

function SideNav({ url }) {
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

  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  return (
    <nav className="app__sidenav">
      <div>
        <div className="app__sidenav-logo">
          <NavLink
            link="/account"
            icon={
              !avatarUrl ? (
                <PersonIcon className="icon" />
              ) : (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="app__sidenav-profile-i"
                />
              )
            }
          />
          <span>{username}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "space-between",
          }}
        >
          <div>
            <ul className="app__sidenav-links">
              {links.map((link, index) => (
                <li key={index} className="app__sidenav-link">
                  <NavLink
                    link={link.href}
                    icon={<link.icon className="app__sidenav-link-icon" />}
                    text={link.name}
                    border={"0"}
                  />
                </li>
              ))}
              <li>
                <button
                  className="app__sidenav-signout"
                  onClick={() => supabase.auth.signOut()}
                >
                  <ExitIcon className="btn-icon" />
                  <span style={{ marginLeft: "10px" }}>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ link, icon, text, border }) {
  return (
    <>
      <Link to={link}>
        <div
          style={{
            height: "min-content",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="app__sidenav-profile" style={{ border: border }}>
            <div className="app__sidenav-profile-i">{icon}</div>
          </div>
          <p style={{ fontSize: "0.8rem", margin: 0 }}>{text}</p>
        </div>
      </Link>
    </>
  );
}

export default AppRouter;
