package models

type Restaurant struct {
	ID        string `bson:"_id,omitempty"`
	name      string `bson:"name"`
	openTime  string `bson:"open_time"`
	closeTime string `bson:"close_time"`
	thumbnail string `bson:"thumbnail"`
	address   string `bson:"address"`
}

type MenuItem struct {
	ID           string   `bson:"_id,omitempty"`
	restaurantID string   `bson:"restaurant_id"`
	price        float64  `bson:"price"`
	name         string   `bson:"name"`
	rateCount    int      `bson:"rate_count"`
	starCount    int      `bson:"star_count"`
	thumbnail    string   `bson:"thumbnail"`
	attributes   []string `bson:"attributes"`
}
