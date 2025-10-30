import React from 'react';
import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import './RestaurantPage.css'


export function StarBar({ rating }) {
  rating = parseFloat(rating);
  const stars = [];

  const fullStars = Math.floor(rating);
  const decimal = rating - fullStars;

  const hasHalf = decimal >= 0.25 && decimal < 0.75;
  const hasExtraFull = decimal >= 0.75;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<span key={i} className="star-filled">★</span>);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<span key={i} className="star-half">★</span>);
    } else if (i === fullStars + 1 && hasExtraFull) {
      stars.push(<span key={i} className="star-filled">★</span>);
    } else {
      stars.push(<span key={i} className="star-empty">★</span>);
    }
  }
  return (
    <div className="star-bar">
      <span className="rating-value">{Number(rating).toFixed(1)}</span>
      <div className="stars-wrapper">{stars}</div>
    </div>
  );
}

function RestaurantPage() {
  const { state } = useLocation();
  const[menu, setMenu] = useState([]);
  const restaurant  = state?.restaurant;
  const [priceLimit, setPriceLimit] = useState(30);
  const [calorieLimit, setCalorieLimit] = useState(1000);
  const [minRating, setMinRating] = useState(0);

  if (!restaurant) {
    return <div>No data found for this restaurant.</div>
  }

  useEffect(() => {
    fetch(`http://localhost:8080/restaurants/${restaurant.ID}/menu`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMenu(data);
      })
      .catch((error) => {
        console.error("Error fetching Menu:", error);
      });
  }, [restaurant]);

  const filteredMenu = menu.filter((item => {
    const avgRating = item.RateCount > 0 ? item.StarCount / item.RateCount : 0;
    return (
      item.Price <= priceLimit &&
      item.Calories <= calorieLimit &&
      avgRating >= minRating
    )
  }))

  return (
    <div className="App">
      <div>
          <h1>{restaurant.Name}</h1>
          <p>{restaurant.Address}</p>
          <p>{restaurant.OpenTime} - {restaurant.CloseTime}</p>
      </div>
      <div className="filter-sliders">
        <div className="filter">
          <label>💲 Max Price: ${priceLimit}</label>
          <input
            type='range'
            min='0'
            max='30'
            step='1'
            value={priceLimit}
            onChange={(e) => setPriceLimit(Number(e.target.value))}
            />
        </div>
        <div className="filter">
          <label>🥗 Max Calories: {calorieLimit}</label>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            step="50"
            value={calorieLimit} 
            onChange={(e) => setCalorieLimit(Number(e.target.value))} 
          />
        </div>

        <div className="filter">
          <label>⭐ Min Rating: {minRating}</label>
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.5"
            value={minRating} 
            onChange={(e) => setMinRating(Number(e.target.value))} 
          />
        </div>
      </div>
      <div className="card-container">
        {filteredMenu.length === 0 ? (
          <p className='no-menu'>No menu items available.</p>
        ) : (
          filteredMenu.map((item) => (
              <div key={item.ID} className="menu-item-card">
                <div className='menu-item-details'>
                  <div className = 'menu-item-calories'>{item.Calories} calories
                    </div>
                  <h2 className='menu-item-name'>{item.Name}
                    </h2>
                  <p className='menu-item-price'>${item.Price.toFixed(2)}</p>
                  <div className='menu-item-rating'>
                    {item.RateCount > 0 ? (
                      <>
                        <StarBar rating={(item.StarCount / item.RateCount).toFixed(1)} />
                        <span className='review-count'>({item.RateCount})</span>
                      </>
                    )  :  "No ratings"}
                  </div>
                  <div className='menu-item-tags'>
                    {item.Attributes && item.Attributes.length > 0 && item.Attributes.map((attr) => (
                      <span 
                      key={attr} 
                      className={`${attr}`}
                      >
                        {attr === "Vegan" && (
                        <svg
                          className="tag-badge"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          style={{ marginLeft: "4px" }}
                        >
                          <circle cx="8" cy="8" r="8" fill="#4CAF50"/>
                          <text x="8" y="12" textAnchor="middle" fontSize="10" fill="white">VG</text>
                      </svg>
                        )}
                        {attr === "Vegetarian" && (
                          <svg
                            className="tag-badge"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            style={{ marginLeft: "4px" }}
                          >
                            <circle cx="8" cy="8" r="8" fill = "#FF9800"/>
                            <text x="8" y="12" textAnchor="middle" fontSize="10" fill="white">V</text>
                          </svg>
                        )}
                        {" "}
                        {attr}
                      </span>
                    ))}
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
}

export default RestaurantPage;