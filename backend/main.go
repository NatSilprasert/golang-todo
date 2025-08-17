package main

import (
    "log"
    "os"

    "github.com/NatSilprasert/golang-todo/backend/config"
    "github.com/NatSilprasert/golang-todo/backend/models/auth"
    "github.com/NatSilprasert/golang-todo/backend/models/todo"
    "github.com/NatSilprasert/golang-todo/backend/routes"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "github.com/joho/godotenv"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }

    config.ConnectDatabase()
    config.DB.AutoMigrate(&auth.User{}, &todo.Todo{})

    app := fiber.New()

    // ✅ enable CORS (allow requests from frontend)
    app.Use(cors.New(cors.Config{
        AllowOrigins: "http://localhost:5173",
        AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
        AllowHeaders: "*",
    }))

    routes.Setup(app)

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Fatal(app.Listen(":" + port))
}