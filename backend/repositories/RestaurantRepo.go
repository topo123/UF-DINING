package repositories

import (
	"hci/ufdining/models"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

type RestaurantRepository interface {
	GetRestaurants() ([]models.Restaurant, error)
	GetMenuByRestaurantID(restaurantID string) ([]models.MenuItem, error)
	UpdateNewRating(menuItemID string, rating int) error
}

type restaurantRepo struct {
	dbClient *mongo.Client
	// TODO: set this up
}

func NewRestaurantRepository(client *mongo.Client) RestaurantRepository {
	return &restaurantRepo{dbClient: client}
}

func (r *restaurantRepo) GetRestaurants() ([]models.Restaurant, error) {
	// Implementation to fetch restuarants from the database
	// TODO: set this up
	return []models.Restaurant{}, nil
}

func (r *restaurantRepo) GetMenuByRestaurantID(restaurantID string) ([]models.MenuItem, error) {
	// Implementation to fetch menu by restuarant ID from the database
	// TODO: set this up
	return []models.MenuItem{}, nil
}

func (r *restaurantRepo) UpdateNewRating(menuItemID string, rating int) error {
	// Implementation to update new rating for a menu item in the database
	return nil
}
