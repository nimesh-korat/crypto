import React, { useEffect, useState } from "react";
import "./App.css"; // Import CSS file

function App() {
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState("");

  // Fetch initial data
  useEffect(() => {
    const loadAllCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        setError("Failed to load cryptocurrency data.");
      }
    };

    loadAllCoins();
  }, []);

  // Random update simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => {
          const randomPercent = (Math.random() * (1.5 - 0.1) + 0.1).toFixed(2); // 0.1% - 1.5%
          const isPositive = Math.random() > 0.5; // Random up or down

          // Apply fluctuation
          const priceChangeFactor =
            1 + (isPositive ? randomPercent / 100 : -randomPercent / 100);
          const newPrice = coin.current_price * priceChangeFactor;

          return {
            ...coin,
            current_price: newPrice,
            price_change_percentage_24h: isPositive
              ? coin.price_change_percentage_24h + parseFloat(randomPercent)
              : coin.price_change_percentage_24h - parseFloat(randomPercent),
          };
        })
      );
    }, 1500); // every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="d-flex flex-column">
      <div className="container mt-5">
        <h2 className="text-center mb-4">
          Top Cryptocurrencies (Simulated Live Data 🚀)
        </h2>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="table-responsive d-flex justify-content-center">
          <table
            className="table table-striped table-bordered align-middle text-center"
            style={{ maxWidth: "1200px" }}
          >
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Coin</th>
                <th>Symbol</th>
                <th>Price (USD)</th>
                <th>Market Cap</th>
                <th>24h Change (%)</th>
                <th>Total Volume</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr key={coin.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={coin.image}
                      alt={coin.name}
                      width="25"
                      className="me-2"
                    />
                    {coin.name}
                  </td>
                  <td>{coin.symbol.toUpperCase()}</td>
                  <td>
                    $
                    {coin.current_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td
                    className={
                      coin.price_change_percentage_24h >= 0
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>${coin.total_volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Marquee */}
        <marquee
          id="crypto-marquee"
          behavior="scroll"
          direction="left"
          scrollAmount="6"
          onMouseOver={(e) => e.target.stop()}
          onMouseLeave={(e) => e.target.start()}
        >
          {coins.map((coin) => (
            <span key={coin.id}>
              <img src={coin.image} alt={coin.name} />
              {coin.name} ({coin.symbol.toUpperCase()}) - $
              {coin.current_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          ))}
        </marquee>
      </div>
    </div>
  );
}

export default App;
