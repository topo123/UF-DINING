package services

import (
	"hci/ufdining/models"
	"hci/ufdining/repositories"
)

type RestaurantService interface {
	GetRestaurants() ([]models.Restaurant, error)
	GetMenuByRestaurantID(restaurantID string) ([]models.MenuItem, error)
	UpdateNewRating(menuItemID string, rating int) error
}

type restaurantService struct {
	repo repositories.RestaurantRepository
}

func NewRestaurantService(repo repositories.RestaurantRepository) RestaurantService {
	return &restaurantService{repo: repo}
}

func (s *restaurantService) GetRestaurants() ([]models.Restaurant, error) {
	return s.repo.GetRestaurants()
}

func (s *restaurantService) GetMenuByRestaurantID(restaurantID string) ([]models.MenuItem, error) {
	return s.repo.GetMenuByRestaurantID(restaurantID)
}

func (s *restaurantService) UpdateNewRating(menuItemID string, rating int) error {
	return s.repo.UpdateNewRating(menuItemID, rating)
}
