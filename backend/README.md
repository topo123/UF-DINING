Backend for the FLVR RTR Project

Restful API with in memory store

**Main endpoints needed**

GET /resturants

- Get all resturants and some info about them
- Used for home screen, for searching resturants

Response

- Array of resturant objects including name, location, times, thumbnails

GET /menu?restuarant={resturant_name}

- Get the menu and related info (like ratings)
- Used for resturant menu view, for filtering and rating menu items

Response

- Array of menu items and related info

POST /rate

- Rate an item 1-5 stars

Response

- Success code only

**Other features needed/wanted**

Restuarant Menu Portal

- Remove and add menu items

**Database design**
An incredibly simple way we can do this

- Store resturant info in json file, with all of them as a list of json object
- Store menu info in a similar way
- To handle ratings, keep a "total_stars", and "rating_number" value in the json object. Then when displaying, we can display/return round(total_stars/rating_number).
