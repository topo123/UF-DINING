import { useState, useEffect } from 'react'
import './App.css'
import { Link } from 'react-router-dom';

function App() {
  const[restaurants, setRestaurants] = useState([]);
  const[searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetch("http://localhost:8080/restaurants")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRestaurants(data);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);



  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {restaurant.Thumbnail && (
              <img 
                src={restaurant.Thumbnail} 
                alt={restaurant.Name} 
                className="thumbnail" 
              />
            )}
            <h2 className='restaurant-name'>{restaurant.Name}</h2>
            <p>{restaurant.Address}</p>
            <p>{restaurant.OpenTime} - {restaurant.CloseTime}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default App;
