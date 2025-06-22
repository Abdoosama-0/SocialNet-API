# Social Media Backend System

## 📌 Project Overview

This is a scalable and secure backend for a social media platform built using **Node.js**, **Express**, **Docker**, **Redis**, and **MongoDB**. It offers users essential social media functionalities, including post creation, likes, comments, user profile management, and a robust admin dashboard.

## 🌐 Live API Preview
The API is deployed on Railway and is accessible publicly for testing.
[Go to Live demo](https://socialnet-api-production.up.railway.app/)

## 🔗 Postman Public Workspace  
You can explore and test all API endpoints through the public Postman workspace below:  
[🧪 Open SocialNet-API Workspace](https://www.postman.com/goatme/socialnet-api/overview)

## 🚀 Features

* **Authentication & Authorization:**

  * Secure JWT-based authentication.
  * Role-based access control (Admin and User roles).
  * Secure password encryption using bcrypt.
* **Social Media Functionalities:**

  * Create, edit, and delete posts.
  * Like and comment on posts.
  * User profile management.
* **Media Upload:**

  * Media upload for posts using **Cloudinary** with image optimization.
* **Password Management:**

  * Password reset via email (SMTP setup required).
* **Admin Dashboard:**

  * Manage users and content.
  * View platform statistics.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB
* **Caching:** Redis
* **Authentication:** JWT, bcrypt
* **Media Management:** Cloudinary
* **Containerization:** Docker


### 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Abdoosama-0/SocialNet-API.git
   ```

2. Navigate to the project directory:

   ```bash
   cd SocialNet-API
   ```
3. Set up environment variables (.env file):
  ```
MONGODB_URI = your_mongodb_uri

GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
CALLBACK_URL = your_callback_url

COOKIE_SECRET = your_cookie_secret

SECRET_TOKEN = your_secret_token

CLOUD_NAME = your_cloud_name
API_KEY = your_api_key
API_SECRET = your_api_secret

EMAIL_USER = your_email_user
EMAIL_PASS = your_email_pass

REDIS_HOST = your_redis_host
REDIS_PORT = your_redis_port
REDIS_USERNAME = your_redis_username
REDIS_PASSWORD = your_redis_password

   ```
4. Install dependencies :

   ```bash
   npm install
   npm run dev
   ```


### API Documentation

* RESTful API endpoints for user, post, and admin functionalities.
* Testable using API clients like Postman or Insomnia.
* Swagger documentation at: `/api-docs` (if integrated).

## 📂 Project Structure

```
/social-media-platform
├── controllers
├── middleware
├── models
├── routes
├── config
├── docker-compose.yml
└── .env
```

## 🌐 Deployment

* Easily deployable with Docker.
* Secure environment variables and HTTPS recommended for production.



## 🙌 Contributions

Contributions are welcome! Please fork the repository and create a pull request.

## 📧 Contact

* Developer: \[Abdelrhman Osama Mostafa Shawky]
* Email: \[abdalrhman.osama.mostafa@gmail.com]
