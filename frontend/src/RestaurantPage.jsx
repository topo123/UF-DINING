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


  return (
    <div className="App">
      <div>
          <h1>{restaurant.Name}</h1>
          <p>{restaurant.Address}</p>
          <p>{restaurant.OpenTime} - {restaurant.CloseTime}</p>
      </div>
      <div className="card-container">
        {!menu || menu.length === 0 ? (
          <p className='no-menu'>No menu items available.</p>
        ) : (
          menu.map((item) => (
              <div key={item.ID} className="menu-item-card">
             
                <div className='menu-item-details'>
                  <h2 className='menu-item-name'>{item.Name}</h2>
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
                      style={{display: 'block', marginBottom: '4px'}}
                      >
                        🏷️ {attr}
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