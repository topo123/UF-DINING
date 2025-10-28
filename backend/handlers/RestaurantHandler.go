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
	restaurants, err := h.service.GetRestaurants()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, restaurants)
}

func (h *restaurantHandler) GetMenuByRestaurantID(c *gin.Context) {
	// Implementation to handle getting menu by restaurant ID
}

func (h *restaurantHandler) UpdateNewRating(c *gin.Context) {
	// Implementation to handle updating new rating for a menu item
}
