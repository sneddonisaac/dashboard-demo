import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Screenshots() {
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
    <div>
      {game.screenshots?.map((item) => (
        <img src={item.image} style={{ width: "100px", height: "100px" }} />
      ))}
    </div>
  );
}
