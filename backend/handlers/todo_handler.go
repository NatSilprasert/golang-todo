package handlers

import (
	"github.com/NatSilprasert/golang-todo/backend/config"
	"github.com/NatSilprasert/golang-todo/backend/models/todo"
	"github.com/gofiber/fiber/v2"
)

func GetTodos(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	var todos []todo.Todo
	if err := config.DB.Where("user_id = ?", userId).Find(&todos).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get todos"})
	}

	return c.JSON(todos)
}

func CreateTodo(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	todo := new(todo.Todo)
	if err := c.BodyParser(todo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	todo.UserID = userId

	if err := config.DB.Create(&todo).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create todo"})
	}

	return c.JSON(fiber.Map{"message": "Todo added"})
}

func UpdateTodo(c *fiber.Ctx) error {
    userId := c.Locals("userId").(uint)
    id := c.Params("id")

    var todoItem todo.Todo
    if err := config.DB.Where("id = ? AND user_id = ?", id, userId).First(&todoItem).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Todo not found"})
    }

    if err := c.BodyParser(&todoItem); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
    }

    if err := config.DB.Save(&todoItem).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update todo"})
    }

    return c.JSON(fiber.Map{"message": "Todo updated"})
}

func DeleteTodo(c *fiber.Ctx) error {
    userId := c.Locals("userId").(uint)
    id := c.Params("id")

    if err := config.DB.Where("id = ? AND user_id = ?", id, userId).Delete(&todo.Todo{}).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete todo"})
    }

    return c.JSON(fiber.Map{"message": "Todo deleted"})
}
