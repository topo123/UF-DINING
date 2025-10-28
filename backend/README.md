**Backend Documentation**

**API Paths**

GET /restaurants

- returns all restaurants in the database
- no parameters

GET /restaurants/:id/menu

- returns all menu items corresponding to a restaurant id
- "id" parameter in url
- Ex: http://localhost:8080/restaurants/69002374f5ea4362ea4ba204/menu

POST /rating

- adds 1 rating to a menu item
- parameter body has 2 fields
  -- menu_item_id string
  -- rating int (rating 1-5 stars)

**Database Setup/Structure**

To gain connection access to the database, add a .env file with the key MONGO_USER_PASSWORD=...

- Check email from hugoliu@ufl.edu for value

The DB name is "Dining"
The DB has a "Restaurants" collection, and a "Menu_Items" collection

There are currently some dummy variables inside that can be seen using the /GET commands.

Message Hugo on whatsapp for more info or if you need direct mongoDB platform access

**TODO**

We can choose to add an admin portal that allows us to modify/add/delete stuff directly in the app

- new endpoints for CRUD operations
- WIll also need frontend work, so don't start without talking to frontend team

User login and rating memory

- We should have users, each with an user id
- When a user rates something, we should store that theyve made this rating somewhere
- Then, we can delete the rating or update it in the future, if they re-rate a certain item
- Needs some frontend work for auth also, talk to frontend team, and I can help with database setup
