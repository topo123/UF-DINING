import React from 'react';
import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import './RestaurantPage.css'
import { getAuth } from "firebase/auth";


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

function EditableStarBar({ rating, onRate }) {
  const [hover, setHover] = useState(0);

  const displayRating = hover || rating;

  return (
    <div className="editable-stars" style={{ display: "flex", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        let starClass = "star-empty";
        if (displayRating >= star) starClass = "star-filled";
        else if (displayRating >= star - 0.5) starClass = "star-half";

        return (
          <span
            key={star}
            className={starClass}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRate(star)}
            style={{ fontSize: "1.2rem", marginRight: "2px" }}
          >
            ★
          </span>
        );
      })}
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
  const [userRatings, setUserRatings] = useState({});
  const [ratingToggles, setRatingToggles] = useState({});
  const [dietaryFilters, setDietaryFilters] = useState({ vegan: false, vegetarian: false });
  const auth = getAuth();
  const currentUser = auth.currentUser;

 

  if (!restaurant) {
    return <div>No data found for this restaurant.</div>
  }

  const toggleRating = (itemId) => {
    setRatingToggles(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

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
    
    // Check dietary filters
    const hasSelectedDiet = dietaryFilters.vegan || dietaryFilters.vegetarian;
    if (hasSelectedDiet) {
      const itemAttributes = item.Attributes || [];
      const matchesDiet = (dietaryFilters.vegan && itemAttributes.includes("Vegan")) ||
                          (dietaryFilters.vegetarian && itemAttributes.includes("Vegetarian"));
      if (!matchesDiet) return false;
    }
    
    return (
      item.Price <= priceLimit &&
      item.Calories <= calorieLimit &&
      avgRating >= minRating
    )
  }))
  
  const handleUserRate = (itemId, value) => {
    setUserRatings((prev) => ({
      ...prev,
      [itemId]: value,
    }));

    console.log(currentUser.uid, itemId, value);

    fetch('http://localhost:8080/rating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_item_id: itemId,
        user_id: currentUser.uid, 
        rating: value,
      }),
    })
    
    .then(res => {
      if (!res.ok) throw new Error('Failed to submit rating');
      return res.json();
    })
    .then(data => {
      console.log('Rating submitted successfully', data);
    })
    .then(data => {
      console.log('Rating submitted successfully', data);
      fetch(`http://localhost:8080/restaurants/${restaurant.ID}/menu`)
        .then((response) => response.json())
        .then((updatedMenu) => setMenu(updatedMenu))
        .catch((err) => console.error('Error refreshing menu:', err));
    })
    .catch(err => console.error(err));
};


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

        <div className="filter-dietary">
          <label>Dietary Preferences:</label>
          <div className="dietary-filter-boxes">
            <button 
              className={`dietary-filter-btn ${dietaryFilters.vegan ? 'active' : ''}`}
              onClick={() => setDietaryFilters(prev => ({ ...prev, vegan: !prev.vegan }))}
            >
              <svg className="tag-badge" width="20" height="20" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8" fill="#4CAF50"/>
                <text x="8" y="12" textAnchor="middle" fontSize="10" fill="white">VG</text>
              </svg>
              Vegan
            </button>
            <button 
              className={`dietary-filter-btn ${dietaryFilters.vegetarian ? 'active' : ''}`}
              onClick={() => setDietaryFilters(prev => ({ ...prev, vegetarian: !prev.vegetarian }))}
            >
              <svg className="tag-badge" width="20" height="20" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8" fill="#FF9800"/>
                <text x="8" y="12" textAnchor="middle" fontSize="10" fill="white">V</text>
              </svg>
              Vegetarian
            </button>
          </div>
        </div>
      </div>
      <div className="card-container">
        {filteredMenu.length === 0 ? (
          <p className='no-menu'>No menu items available.</p>
        ) : (
          filteredMenu.map((item) => (
              <div key={item.ID} className="menu-item-card">
                <div className='menu-item-details'>
                   <h2 className='menu-item-name'>
                    {item.Name}
                    
                    {item.Attributes && item.Attributes.length > 0 && (
                      <span className='menu-item-tag-inline'>
                        {item.Attributes.map((attr) => (
                          <span key={attr} className={`${attr}`}>
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
                          </span>
                        ))}
                      </span>
                     )}
                  </h2>
                  <div className='menu-item-calories'>{item.Calories} calories</div>

                  <p className='menu-item-price'>${item.Price.toFixed(2)}</p>

                  <div className='menu-item-rating'>
                    {item.RateCount > 0 ? (
                      <>
                        <StarBar rating={(item.StarCount / item.RateCount).toFixed(1)} />
                        <span className='review-count'>({item.RateCount})</span>
                      </>
                    )  :  "No ratings"}
                  </div>
                    <div className="menu-item-user-rating">
                      {!ratingToggles[item.ID] ? (
                        <button onClick={() => toggleRating(item.ID)}>RATE</button>
                      ) : (
                        <>
                    <EditableStarBar
                      rating={userRatings[item.ID] || 0}
                      onRate={(value) => handleUserRate(item.ID, value)}
                    />
                    <button onClick={() => toggleRating(item.ID)} style={{ marginTop: "8px", marginLeft: "8px"}}>
                      Exit
                    </button>
                    {(userRatings[item.ID] || 0) > 0 && (<span style={{ marginLeft: "8px" }}> Your rating: {(userRatings[item.ID] || 0).toFixed(1)}</span>)}
                    </>
                    )}
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