import React from 'react';
import { useParams } from 'react-router-dom';

function RestaurantPage() {
  const { id } = useParams();
  
  return (
    <div>
        <h1>Restaurant Page for ID: {id}</h1>
    </div>
  );
}

export default RestaurantPage;