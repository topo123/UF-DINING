import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const[restaurants, setRestaurants] = useState([]);
  const[loading, setLoading] = useState(true);
  const[searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetch("http://localhost:8080/restaurants")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRestaurants(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
          <div className='restaurant-card' key={restaurant.ID}>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
