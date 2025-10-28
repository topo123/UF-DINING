package main

import (
	"context"
	"fmt"
	"os"

	"hci/ufdining/handlers"
	"hci/ufdining/repositories"
	"hci/ufdining/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
)

func main() {

	// Create MongoClient
	godotenv.Load(".env")
	user_string := os.Getenv("MONGO_USER_PASSWORD")
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(user_string).SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(opts)
	if err != nil {
		panic(err)
	}
	// Closes the connection after main function is done
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	restaurantRepo := repositories.NewRestaurantRepository(client, "Dining", "Restaurants", "Menu_Items")
	restaurantService := services.NewRestaurantService(restaurantRepo)
	restuarantHandler := handlers.NewRestaurantHandler(restaurantService)

	// TODO: remove
	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

	router := gin.Default()
	router.GET("/restaurants", restuarantHandler.GetRestaurants)
	router.GET("/restaurants/:id/menu", restuarantHandler.GetMenuByRestaurantID)
	router.POST("/rating", restuarantHandler.UpdateNewRating)

	router.Run(":8080")
}
