package main

import (
	"github.com/NatSilprasert/golang-todo/backend/config"   // โหลด package config ที่เราจะสร้างไว้สำหรับเชื่อม DB
	"github.com/NatSilprasert/golang-todo/backend/models/auth"   // โหลดโมเดล User กับ Todo
	"github.com/NatSilprasert/golang-todo/backend/models/todo"   // โหลดโมเดล User กับ Todo
	"github.com/NatSilprasert/golang-todo/backend/routes"   // โหลดไฟล์ route ที่รวม API routes ต่าง ๆ
	"log"
	"os"

	"github.com/gofiber/fiber/v2"     // web framework Fiber
	"github.com/joho/godotenv"        // โหลด .env ไฟล์
)

func main() {
	// โหลดค่าตัวแปรใน .env มาใช้ (เช่น DB_PASSWORD, JWT_SECRET)
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")  // ถ้าโหลดไม่ได้ ให้หยุดโปรแกรม
	}

	// เชื่อมต่อฐานข้อมูล PostgreSQL
	config.ConnectDatabase()

	// สร้างตารางใน DB อัตโนมัติ ตาม struct User, Todo ที่เราเขียนไว้
	config.DB.AutoMigrate(&auth.User{}, &todo.Todo{})

	// สร้าง Fiber app instance
	app := fiber.New()

	// ตั้งค่า route ทั้งหมดของโปรเจค (auth, todo)
	routes.Setup(app)

	// ดึง port จาก environment ถ้าไม่ตั้งไว้จะใช้ 8080 เป็นค่าเริ่มต้น
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// รันเว็บเซิร์ฟเวอร์ที่ port ที่กำหนด
	log.Fatal(app.Listen(":" + port))
}