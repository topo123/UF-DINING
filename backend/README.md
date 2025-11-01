**Backend Documentation**

**API Paths**

GET /restaurants is a request that pulls all restaurants from our database and returns it

GET /restaurants/:id/menu is a request that pulls all menu items for a certain restaurant using a database object id, and supports loading and viewing menus in our frontend.

GET /rating/:menu_id/menu/:user_id/user is a request that indicates whether a user has made a rating for a certain menu item already, and what that rating is.

POST /rating is a request that requires a user id, menu item id, and rating in the request body, and allows the frontend to update or create a new review for a menu item.

**Database Setup/Structure**

To gain connection access to the database, add a .env file with the key MONGO_USER_PASSWORD=...

- Check email from hugoliu@ufl.edu for value

The DB name is "Dining"
The DB has a "Restaurants" collection, and a "Menu_Items" collection

There are currently some dummy variables inside that can be seen using the /GET commands.

Message Hugo on whatsapp for more info or if you need direct mongoDB platform access
