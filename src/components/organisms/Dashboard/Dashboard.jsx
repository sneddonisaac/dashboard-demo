import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../../../templates/Layout/Layout";
import Header from "../../atoms/Header/Header";
import "./Dashboard.scss";

function Overview() {
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

  console.log(data);

  return (
    <>
      <Header title="Dashboard" description="Welcome to the dashboard demo." />
      <div>
        <h2>Top 5 Games</h2>
        <div className="app__dashboard-game-grid">
          {data?.slice(0, 5).map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="app__card"
            >
              <Link to={`/games/${item.id}`}>
                <div className="app__card-block">
                  <div className="card__image-block">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="card__image-img"
                    />
                  </div>
                  <div className="card__content-block">
                    <h1 className="card__content-title">{item.title}</h1>
                    <h4 className="card__content-developer">By {item.developer}</h4>
                    <p className="card__content-description">{item.short_description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Layout(Overview);
