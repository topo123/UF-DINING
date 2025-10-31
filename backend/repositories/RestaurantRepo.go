package repositories

import (
	"context"
	"fmt"
	"hci/ufdining/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type RestaurantRepository interface {
	GetRestaurants(ctx context.Context) ([]models.Restaurant, error)
	GetMenuByRestaurantID(ctx context.Context, restaurantID string) ([]models.MenuItem, error)
	UpdateNewRating(ctx context.Context, menuItemID string, userID string, oldRating int32, newRating int32) error
	GetRating(ctx context.Context, userID string, menuItemID string) (int32, error)
}

type restaurantRepo struct {
	dbClient                *mongo.Client
	dbName                  string
	collectionName          string
	menuItemsCollectionName string
	resCollectionName       string
	reviewCollectionName    string
}

func NewRestaurantRepository(client *mongo.Client, dbName string, resCollectionName string, menuItemsCollectionName string, review string) RestaurantRepository {
	return &restaurantRepo{
		dbClient:                client,
		dbName:                  dbName,
		resCollectionName:       resCollectionName,
		menuItemsCollectionName: menuItemsCollectionName,
		reviewCollectionName:    review}
}

func (r *restaurantRepo) GetRating(ctx context.Context, userID string, menuItemID string) (int32, error) {
	collection := r.dbClient.Database(r.dbName).Collection(r.reviewCollectionName)

	menuItemObjectID, err := bson.ObjectIDFromHex(menuItemID)

	if err != nil {
		return -1, err
	}

	cursor, err := collection.Find(ctx, bson.M{"menu_item_id": menuItemObjectID, "user_id": userID})

	if err != nil {
		return -1, err
	}

	defer cursor.Close(ctx)

	if !cursor.Next(ctx) {
		fmt.Print("Did not find a document for the collection")
		return -1, nil
	}

	var review models.Review
	err = cursor.Decode(&review)

	if err != nil {
		return -1, err
	}

	return review.Rating, nil
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

func (r *restaurantRepo) UpdateNewRating(ctx context.Context, menuItemID string, userID string, oldRating int32, newRating int32) error {
	// Implementation to update new rating for a menu item in the database
	menuItemObjectID, err := bson.ObjectIDFromHex(menuItemID)
	if err != nil {
		return err
	}

	menu_collection := r.dbClient.Database(r.dbName).Collection(r.menuItemsCollectionName)
	user_collection := r.dbClient.Database(r.dbName).Collection(r.reviewCollectionName)

	if oldRating == -1 {
		fmt.Println("A new review to be added")
		_, err = user_collection.InsertOne(ctx, bson.M{
			"menu_item_id": menuItemObjectID,
			"user_id":      userID,
			"rating":       newRating,
		})

		if err != nil {
			return err
		}
		_, err = menu_collection.UpdateByID(ctx, menuItemObjectID, bson.M{
			"$inc": bson.M{
				"rate_count": 1,
				"star_count": newRating,
			},
		})

		if err != nil {
			return err
		}

	} else {

		fmt.Println("DB already has this review")
		user_collection_filter := bson.M{"user_id": userID}
		user_collection_update := bson.M{
			"$set": bson.M{
				"rating": newRating,
			},
		}

		_, err = user_collection.UpdateOne(ctx, user_collection_filter, user_collection_update)

		if err != nil {
			return err
		}

		_, err = menu_collection.UpdateByID(ctx, menuItemObjectID, bson.M{
			"$inc": bson.M{
				"star_count": newRating - oldRating,
			},
		})

		if err != nil {
			return err
		}
	}

	return nil
}
