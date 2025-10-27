package handlers

import (
	"hci/ufdining/services"

	"github.com/gin-gonic/gin"
)

type restaurantHandler struct {
	service services.RestaurantService
}

func NewRestaurantHandler(service services.RestaurantService) *restaurantHandler {
	return &restaurantHandler{service: service}
}

func (h *restaurantHandler) GetRestaurants(c *gin.Context) {
	// Implementation to handle getting restaurants
}

func (h *restaurantHandler) GetMenuByRestaurantID(c *gin.Context) {
	// Implementation to handle getting menu by restaurant ID
}

func (h *restaurantHandler) UpdateNewRating(c *gin.Context) {
	// Implementation to handle updating new rating for a menu item
}
