import { UploadIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

import "./Avatar.scss";

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="app__avatar">
      <div
        className="app__avatar-image-block"
        style={{ width: size, height: size }}
      >
        <input
          style={{
            visibility: 'hidden'
          }}
          className="app__avatar-image-input"
          type="file"
          id="single"
          accept="image/*"
          placeholder=""
          onChange={uploadAvatar}
          disabled={uploading}
        />
        <div className="app__avatar-image-input-icon-bg">
          <UploadIcon />
        </div>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="app__avatar-image"
            style={{ height: size, width: size }}
          />
        ) : (
          <div
            className="app__avatar-noimage"
            style={{ height: size, width: size }}
          />
        )}
      </div>
      <div className="app__avatar-upload" style={{ width: size }}>
        <label className="app__avatar-upload-label" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
        </label>
      </div>
    </div>
  );
}
