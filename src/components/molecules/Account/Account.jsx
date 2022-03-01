import { LogoutIcon } from "@heroicons/react/outline";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

import "./Account.scss";
import Header from "../../atoms/Header/Header";
import Avatar from "../../atoms/Avatar/Avatar";

function Account({ session }) {
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

  async function updateProfile({ username, avatar_url }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user?.id,
        username,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app__account">
      <Header title={`Welcome ${username || ""}`} />
      <div className="app__account-form">
        <div className="app__account-form-text">
          <h2>Edit Profile</h2>
          <div className="app__account-form-input-block">
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
          </div>
          <div className="app__account-form-input-block">
            <label htmlFor="username">Name</label>
            <input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="app__account-form-input-block">
            <button
              onClick={() => updateProfile({ username, avatar_url })}
              disabled={loading}
            >
              {loading ? "Loading ..." : "Update"}
            </button>
          </div>
        </div>

        <div className="app__account-form-avatar">
          <Avatar
            url={avatar_url}
            size={300}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, avatar_url: url });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Account;
