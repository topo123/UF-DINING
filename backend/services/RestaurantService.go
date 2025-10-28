package services

import (
	"context"
	"hci/ufdining/models"
	"hci/ufdining/repositories"
)

type RestaurantService interface {
	GetRestaurants(ctx context.Context) ([]models.Restaurant, error)
	GetMenuByRestaurantID(ctx context.Context, restaurantID string) ([]models.MenuItem, error)
	UpdateNewRating(ctx context.Context, menuItemID string, rating int) error
}

type restaurantService struct {
	repo repositories.RestaurantRepository
}

func NewRestaurantService(repo repositories.RestaurantRepository) RestaurantService {
	return &restaurantService{repo: repo}
}

func (s *restaurantService) GetRestaurants(ctx context.Context) ([]models.Restaurant, error) {
	return s.repo.GetRestaurants(ctx)
}

func (s *restaurantService) GetMenuByRestaurantID(ctx context.Context, restaurantID string) ([]models.MenuItem, error) {
	return s.repo.GetMenuByRestaurantID(ctx, restaurantID)
}

func (s *restaurantService) UpdateNewRating(ctx context.Context, menuItemID string, rating int) error {
	return s.repo.UpdateNewRating(ctx, menuItemID, rating)
}
