import { useState, useEffect, use } from 'react'
import './Restaurants.css'
import { Link, useNavigate } from 'react-router-dom';
import { StarBar } from './RestaurantPage';
import { useAuth } from './AuthContext.jsx';

function Restaurants() {
  const[restaurants, setRestaurants] = useState([]);
  const[searchTerm, setSearchTerm] = useState("");
  const[restaurantRatings, setRestaurantRatings] = useState({});
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/restaurants")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRestaurants(data);
        

        data.forEach((restaurant) => {
          fetch(`http://localhost:8080/restaurants/${restaurant.ID}/menu`).then((res) => res.json()).then((menuItems) => {
            const totalStars = menuItems.reduce((sum, item) => sum + (item.StarCount || 0), 0);
            const totalRates = menuItems.reduce((sum, item) => sum + (item.RateCount || 0), 0);
            const avgRating = totalRates > 0 ? (totalStars / totalRates).toFixed(1) : "N/A";
            setRestaurantRatings((prev) => ({ ...prev, [restaurant.ID]: avgRating }));
          })
        })
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);



  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="App">

  
    <h1 className='title'>
      Dinr        
    </h1>




      <input
        type="text"
        placeholder="Search restaurants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="card-container">
        {filteredRestaurants.map((restaurant) => (
          <Link 
            to={`/restaurant/${restaurant.ID}`} 
            key={restaurant.ID} 
            className="restaurant-card"
            state={{ restaurant}}
          >
            <h2 className='restaurant-name'>{restaurant.Name}</h2>
            <p>{restaurant.Address}</p>
            <p>{restaurant.OpenTime} - {restaurant.CloseTime}</p>
            {restaurantRatings[restaurant.ID] != undefined && restaurantRatings[restaurant.ID] !== "N/A" ? (
              <div className="restaurant-rating">
                <StarBar rating={restaurantRatings[restaurant.ID]} />
              </div>
            ) : (
              <p>No ratings yet</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Restaurants;
