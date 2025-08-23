package auth

import (
    "github.com/NatSilprasert/golang-todo/backend/models/todo"
    "gorm.io/gorm"
)

type User struct {
    gorm.Model
    ID          uint        `json:"id" gorm:"primaryKey"`
    Email       string      `json:"email" gorm:"unique"`
    Password    string      `json:"password"`
    GoogleID    string      `json:"google_id,omitempty" gorm:"unique;null"`
    GithubID    string      `json:"github_id,omitempty" gorm:"unique;null"`
    AuthMethods string      `json:"auth_methods"`    
    Todos       []todo.Todo `json:"todos" gorm:"foreignKey:UserID"`
}