package repositories

import (
	"context"
	"hci/ufdining/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type RestaurantRepository interface {
	GetRestaurants() ([]models.Restaurant, error)
	GetMenuByRestaurantID(restaurantID string) ([]models.MenuItem, error)
	UpdateNewRating(menuItemID string, rating int) error
}

type restaurantRepo struct {
	dbClient                *mongo.Client
	dbName                  string
	collectionName          string
	menuItemsCollectionName string
	resCollectionName       string
}

func NewRestaurantRepository(client *mongo.Client, dbName string, resCollectionName string, menuItemsCollectionName string) RestaurantRepository {
	return &restaurantRepo{
		dbClient:                client,
		dbName:                  dbName,
		resCollectionName:       resCollectionName,
		menuItemsCollectionName: menuItemsCollectionName}
}

func (r *restaurantRepo) GetRestaurants() ([]models.Restaurant, error) {
	// Implementation to fetch restuarants from the database
	var restaurants []models.Restaurant

	collection := r.dbClient.Database(r.dbName).Collection(r.resCollectionName)

	ctx := context.TODO()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &restaurants); err != nil {
		return nil, err
	}

	return restaurants, nil
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
