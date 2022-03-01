import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Layout from "../../../templates/Layout/Layout";
import Header from "../../atoms/Header/Header";

import "./Games.scss";

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

  return (
    <div className="app__games">
      <Header
        title="Games"
      />
      <div className="app__games-card-grid">
        {data?.slice(0.92).map((item) => {
          return (
            <motion.div 
              key={item.id} 
              className="app__games-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Link to={`/games/${item.id}`}>
                <GameCardImg item={item} />
                <h2 className="app__games-card-title">{item.title}</h2>
                <p>{item.short_description}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const GameCardImg = ({ item }) => {
  return (
    <div className="app__games-card-img-block">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="app__games-card-img"
      />
      <span>{item.genre}</span>
    </div>
  );
};

export default Layout(Games);
