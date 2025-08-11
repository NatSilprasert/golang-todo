package routes

import (
	"github.com/NatSilprasert/golang-todo/backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	app.Post("/api/register", handlers.Register)
	app.Post("/api/login", handlers.Login)

	api := app.Group("/api", handlers.JWTProtected())

	api.Get("/todos", handlers.GetTodos)
	api.Post("/todos", handlers.CreateTodo)
	app.Put("/todos/:id", handlers.UpdateTodo)
	app.Delete("/todos/:id", handlers.DeleteTodo)
}