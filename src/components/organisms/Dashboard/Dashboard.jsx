import React, { useEffect, useState } from "react";

import Layout from "../../../templates/Layout/Layout";
import Header from "../../atoms/Header/Header";

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
        <div className="" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {data?.slice(0, 5).map((item) => (
            <div>
              <img src={item.thumbnail} alt={item.title} style={{ width: '300px' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Layout(Overview);
