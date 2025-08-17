package todo

import (
	"gorm.io/gorm"
	"time"
)

type Todo struct {
	gorm.Model
	ID        uint      `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	UserID    uint      `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DueDate   time.Time `json:"due_date"`
}
