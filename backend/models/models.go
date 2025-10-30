package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Restaurant struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	Name      string        `bson:"name"`
	OpenTime  string        `bson:"open_time"`
	CloseTime string        `bson:"close_time"`
	Thumbnail string        `bson:"thumbnail"`
	Address   string        `bson:"address"`
}

type MenuItem struct {
	ID           bson.ObjectID `bson:"_id,omitempty"`
	RestaurantID bson.ObjectID `bson:"restaurant_id"`
	Price        float64       `bson:"price"`
	Calories     int           `bson:"calories"`
	Name         string        `bson:"name"`
	RateCount    int           `bson:"rate_count"`
	StarCount    int           `bson:"star_count"`
	Thumbnail    string        `bson:"thumbnail"`
	Attributes   []string      `bson:"attributes"`
}
