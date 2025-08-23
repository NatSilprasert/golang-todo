package handlers

import (
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/NatSilprasert/golang-todo/backend/config"
	"github.com/NatSilprasert/golang-todo/backend/models/auth"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"

	"github.com/golang-jwt/jwt/v5"
)

func GoogleLogin(c *fiber.Ctx) error {
	var body struct {
		Token string `json:"token"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid Request",
		})
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + body.Token)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to verify token",
		})
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Invalid access token",
		})
	}

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to parse user info",
		})
	}

	user := new(auth.User)
	if err := config.DB.Where("google_id = ?", userInfo["sub"]).First(&user).Error; err != nil {

		user.Email = userInfo["email"].(string)
		user.GoogleID = userInfo["sub"].(string)
		user.AuthMethods = "google"
		
		if err := config.DB.Create(&user).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "This email is already registered",
			})
		}
	}
	


	claims := jwt.MapClaims{
		"sub":   user.GoogleID,  
		"email": user.Email,  
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
		"iat":   time.Now().Unix(),
	}

	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to generate JWT",
		})
	}

	return c.JSON(fiber.Map{
		"token":   signedToken,
		"success": true,
		"message": "Login Successful!",
	})
}

func GithubLogin (c *fiber.Ctx) error {
	var body struct {
		Code string `json:"code"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid Request",
		})
	}

	values := url.Values{}
	values.Set("client_id", os.Getenv("GITHUB_CLIENT_ID"))
	values.Set("client_secret", os.Getenv("GITHUB_CLIENT_SECRET"))
	values.Set("code", body.Code)

	req, _ := http.NewRequest("POST", "https://github.com/login/oauth/access_token", strings.NewReader(values.Encode()))
	req.Header.Set("Accept", "application/json")
	
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to verify token",
		})
	}
	defer resp.Body.Close()

	var tokenResp struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to parse GitHub token",
		})
	}


	if tokenResp.AccessToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Invalid GitHub code",
		})
	}

	userReq, _ := http.NewRequest("GET", "https://api.github.com/user", nil)
	userReq.Header.Set("Authorization", "Bearer "+tokenResp.AccessToken)
	userResp, err := client.Do(userReq)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch GitHub user info",
		})
	}
	defer userResp.Body.Close()

	var githubUser struct {
		ID    json.Number  `json:"id"`
		Email string       `json:"email"`
	}
	if err := json.NewDecoder(userResp.Body).Decode(&githubUser); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to parse GitHub user info",
		})
	}

	// ✅ ถ้า user ไม่มี email ใน GitHub (บาง account private email) ต้องไปดึงจาก /user/emails
	if githubUser.Email == "" {
		emailsReq, _ := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
		emailsReq.Header.Set("Authorization", "Bearer "+tokenResp.AccessToken)
		emailsResp, _ := client.Do(emailsReq)
		if emailsResp != nil {
			defer emailsResp.Body.Close()
			var emails []struct {
				Email    string `json:"email"`
				Primary  bool   `json:"primary"`
				Verified bool   `json:"verified"`
			}
			if err := json.NewDecoder(emailsResp.Body).Decode(&emails); err == nil {
				for _, e := range emails {
					if e.Primary && e.Verified {
						githubUser.Email = e.Email
						break
					}
				}
			}
		}
	}

	var user auth.User
	if err := config.DB.Where("email = ?", githubUser.Email).First(&user).Error; err != nil {
		user = auth.User{
			Email:    githubUser.Email,
			GithubID:  githubUser.ID.String(),
			AuthMethods: "github",
		}
		if err := config.DB.Create(&user).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "This email is already registered",
			})
		}
	}

	claims := jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
		"iat":   time.Now().Unix(),
	}

	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to generate JWT",
		})
	}

	return c.JSON(fiber.Map{
		"token":   signedToken,
		"success": true,
		"message": "Login Successful!",
	})
}

func Register(c *fiber.Ctx) error {
	user := new(auth.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid input",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Cannot hash password",
		})
	}
	user.Password = string(hashedPassword)
	user.AuthMethods = "password"

	if err := config.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "User already exists",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "User created successfully",
	})
}

func Login(c *fiber.Ctx) error {
	body := new(auth.User)
	if err := c.BodyParser(body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid input",
		})
	}

	user := new(auth.User)
	if err := config.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Email not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Incorrect password",
		})
	}

	claims := jwt.MapClaims{
		"id":  user.ID,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("JWT_SECRET")
	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Could not login",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Login Successful!",
		"token": t,
	})
}