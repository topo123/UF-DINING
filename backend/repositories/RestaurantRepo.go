package repositories

import (
	"context"
	"hci/ufdining/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type RestaurantRepository interface {
	GetRestaurants(ctx context.Context) ([]models.Restaurant, error)
	GetMenuByRestaurantID(ctx context.Context, restaurantID string) ([]models.MenuItem, error)
	UpdateNewRating(ctx context.Context, menuItemID string, rating int) error
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

func (r *restaurantRepo) GetRestaurants(ctx context.Context) ([]models.Restaurant, error) {
	// Implementation to fetch restuarants from the database
	var restaurants []models.Restaurant

	collection := r.dbClient.Database(r.dbName).Collection(r.resCollectionName)

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

func (r *restaurantRepo) GetMenuByRestaurantID(ctx context.Context, restaurantID string) ([]models.MenuItem, error) {
	// Implementation to fetch menu by restuarant ID from the database
	// convert restaurantID to bson.ObjectID
	restaurantObjectID, err := bson.ObjectIDFromHex(restaurantID)
	if err != nil {
		return nil, err
	}

	var menuItems []models.MenuItem

	collection := r.dbClient.Database(r.dbName).Collection(r.menuItemsCollectionName)

	cursor, err := collection.Find(ctx, bson.M{"restaurant_id": restaurantObjectID})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &menuItems); err != nil {
		return nil, err
	}

	return menuItems, nil
}

func (r *restaurantRepo) UpdateNewRating(ctx context.Context, menuItemID string, rating int) error {
	// Implementation to update new rating for a menu item in the database
	menuItemObjectID, err := bson.ObjectIDFromHex(menuItemID)
	if err != nil {
		return err
	}

	collection := r.dbClient.Database(r.dbName).Collection(r.menuItemsCollectionName)

	_, err = collection.UpdateByID(ctx, menuItemObjectID, bson.M{
		"$inc": bson.M{
			"rate_count": 1,
			"star_count": rating,
		},
	})

	if err != nil {
		return err
	}

	return nil
}
