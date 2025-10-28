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

type UpdateNewRatingRequest struct {
	MenuItemID string `json:"menu_item_id"`
	Rating     int    `json:"rating"`
}

func (h *restaurantHandler) GetRestaurants(c *gin.Context) {
	restaurants, err := h.service.GetRestaurants(c)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, restaurants)
}

func (h *restaurantHandler) GetMenuByRestaurantID(c *gin.Context) {
	restaurantID, found := c.Params.Get("id")
	if !found {
		c.JSON(400, gin.H{"error": "restaurantID parameter is required"})
	}
	menuItems, err := h.service.GetMenuByRestaurantID(c, restaurantID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, menuItems)
}

func (h *restaurantHandler) UpdateNewRating(c *gin.Context) {
	var req UpdateNewRatingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}
	err := h.service.UpdateNewRating(c, req.MenuItemID, req.Rating)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
}
