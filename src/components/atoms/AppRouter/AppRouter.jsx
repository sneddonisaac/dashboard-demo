import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  MdOutlineVideogameAsset,
  MdLibraryBooks,
  MdDashboard,
  MdPerson,
} from "react-icons/md";

import { supabase } from "../../../supabaseClient";
import "./AppRouter.scss";
import Overview from "../../organisms/Dashboard/Dashboard";
import Games from "../../organisms/Games/Games";
import News from "../../organisms/News/News";
import Account from "../../molecules/Account/Account";
import Game from "../../organisms/Games/Game/Game";
import GameOverview from "../../organisms/Games/Game/GameOverview/GameOverview";
import Screenshots from "../../organisms/Games/Game/Screenshots/Screenshots";
import { LogoutIcon } from "@heroicons/react/outline";



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

          <Route path="news" element={<News />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

const links = [
  {
    id: "01",
    name: "Dashboard",
    icon: MdDashboard,
    href: "/",
  },
  {
    id: "02",
    name: "News",
    icon: MdLibraryBooks,
    href: "/news",
  },
  {
    id: "03",
    name: "Games",
    icon: MdOutlineVideogameAsset,
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
                <MdPerson className="icon" />
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
          </ul>
        </div>

        <div className="app__sidenav-bottom">
          <button
            className="app__sidenav-signout"
            onClick={() => supabase.auth.signOut()}
          >
            <LogoutIcon className="btn-icon" />
            <span style={{ marginLeft: "10px" }}>Logout</span>
          </button>
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
