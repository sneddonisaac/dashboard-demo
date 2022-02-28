import React, { useState, useEffect } from "react";
import Layout from "../../../templates/Layout/Layout";

import "./News.scss";

function News() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function gameData() {
      try {
        const gameData = await fetch(
          "https://video-game-news.p.rapidapi.com/call_of_duty",
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "video-game-news.p.rapidapi.com",
              "x-rapidapi-key":
                "878a1934f2msh5b5afe24654379cp19d79ejsnb36b7e7eedcc",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => setData(data));
      } catch (error) {
        console.error(`Game Data Error: ${error}`);
      }
    }

    gameData();
  }, []);

  console.log(data);

  /* function makeSlug() {
    const title = data[0]?.title;
    /* const titleWithoutSpaces = title.replace(/\s+/g, '');
    console.log(title);
  }

  makeSlug() */

  return (
    <div className="app__news">
      <div className="app__news-card-grid">
        {data?.map((item, index) => (
          <div key={index} className="app__news-card">
            <img
              src={item.image}
              alt={item.title}
              className="app__news-card-img"
            />
            <h2 className="app__news-card-title">{item.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Layout(News);
