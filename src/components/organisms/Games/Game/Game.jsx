import React, { useEffect, useState } from "react";
import {
  Link,
  Routes,
  Route,
  useParams,
  useMatch,
  Outlet,
} from "react-router-dom";
import Layout from "../../../../templates/Layout/Layout";
import Header from "../../../atoms/Header/Header";
import GameOverview from "./GameOverview/GameOverview";

import "./Game.scss";

function Game() {
  const params = useParams();
  const id = params.gameId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function gameData() {
      try {
        setLoading(true);
        fetch(
          `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
              "x-rapidapi-key":
                "878a1934f2msh5b5afe24654379cp19d79ejsnb36b7e7eedcc",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => setData(data));
      } catch (error) {
        console.error(`Game Data Error: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    gameData();

    console.log(data);
  }, []);

  const game = data || [];

  return (
    <div className="app__game">
      <Header title={game.title} action={<Link to="/games">Back</Link>} />
      <div className="app__game-card">
        <div className="app__game-card-left">
          <img src={game.thumbnail} alt="" />
          <div>
            <h2>{game.title}</h2>
            <h4>By {game.developer}</h4>
            <p>{game.short_description}</p>
          </div>
        </div>
        <div
          style={{ width: "1px", height: "100%", backgroundColor: "black" }}
        />
        <div className="app__game-card-right">
          <div>
            <span>{game.genre}</span>
          </div>
        </div>
        <div className="app__game-card-tabmenu">
          <Link to="">
            <h4>Overview</h4>
          </Link>
          <Link to="screenshots">
            <h4>Screenshots</h4>
          </Link>
          <div />
          <div />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Layout(Game);
