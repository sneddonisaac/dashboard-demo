import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../templates/Layout/Layout";

import './Games.scss'

function Games() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function gameData() {
      try {
        fetch("https://free-to-play-games-database.p.rapidapi.com/api/games", {
          method: "GET",
          headers: {
            "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
            "x-rapidapi-key":
              "878a1934f2msh5b5afe24654379cp19d79ejsnb36b7e7eedcc",
          },
        })
          .then((res) => res.json())
          .then((data) => setData(data));
      } catch (error) {
        console.error(`Game Data Error: ${error}`);
      }
    }

    

    gameData();
  }, []);

  /* function makeSlug(data) {
    const title = data?.title;
    const titleOtherCharacters = title.replace(/[^a-zA-Z, s]+/g, '').trim();
    const titleWithoutSpaces = titleOtherCharacters.replace(/\s+/g, '-');
    const result = titleWithoutSpaces.toLowerCase();
    return result;
  } */

  console.log(data?.slice(0, 30));

  return (
    <div className="app__games">
      <div className="app__games-card-grid">
        {data?.slice(0, 30).map((item) => {
          /* const slug = makeSlug(item); */
          return (
          <div key={item.id} className="app__games-card">
            <Link to={`/games/${item.id}`}>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="app__games-card-img"
            />
            <h2 className="app__games-card-title">{item.title}</h2>
            <p>{item.short_description}</p>
            <span>{item.genre}</span>
            </Link>
          </div>
        )})}
      </div>
    </div>
  );
}

export default Layout(Games);
