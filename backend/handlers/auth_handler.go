package handlers

import (
	"github.com/NatSilprasert/golang-todo/backend/config"
	"github.com/NatSilprasert/golang-todo/backend/models/auth"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func Register(c *fiber.Ctx) error {
	user := new(auth.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot hash password"})
	}
	user.Password = string(hashedPassword)

	if err := config.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Username already exists"})
	}

	return c.JSON(fiber.Map{"message": "User created successfully"})
}

func Login(c *fiber.Ctx) error {
	body := new(auth.User)
	if err := c.BodyParser(body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	user := new(auth.User)
	if err := config.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// เช็ครหัสผ่าน
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// สร้าง JWT Token
	claims := jwt.MapClaims{
		"id":  user.ID,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("JWT_SECRET")
	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not login"})
	}

	return c.JSON(fiber.Map{"token": t})
}