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
	Rating     int32  `json:"rating"`
	UserID     string `json:"user_id"`
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

func (h *restaurantHandler) GetRating(c *gin.Context) {
	menuItemID, found := c.Params.Get("menu_id")
	if !found {
		c.JSON(400, gin.H{"error": "menu_id parameter is required"})
	}
	userID, found := c.Params.Get("user_id")
	if !found {
		c.JSON(400, gin.H{"error": "user_id parameter is required"})
	}

	rating, err := h.service.GetRating(c, userID, menuItemID)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, rating)
}

func (h *restaurantHandler) UpdateNewRating(c *gin.Context) {
	var req UpdateNewRatingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	user_rating, _ := h.service.GetRating(c, req.UserID, req.MenuItemID)
	err := h.service.UpdateNewRating(c, req.MenuItemID, req.UserID, user_rating, req.Rating)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Rating updated successfully"})
}
