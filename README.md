# Social Media Platform

## 📌 Project Overview

This is a scalable and secure backend for a social media platform built using **Node.js**, **Express**, **Docker**, **Redis**, and **MongoDB**. It offers users essential social media functionalities, including post creation, likes, comments, user profile management, and a robust admin dashboard.

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

## ⚡ Getting Started

### Prerequisites

* Node.js (v16+)
* Docker
* MongoDB (Local or Cloud)
* Cloudinary Account
* Redis

### Installation

```bash
# Clone the repository
git clone <https://github.com/Abdoosama-0/socialMediaApp-project.git>

# Navigate to the project directory
cd social-media-platform

# Install dependencies
npm install

# Create a .env file and configure the following variables:
MONGODB_URI=<Your MongoDB URI>
REDIS_URL=<Your Redis URL>
JWT_SECRET=<Your JWT Secret>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
SMTP_HOST=<Your SMTP Host>
SMTP_PORT=<Your SMTP Port>
SMTP_USER=<Your SMTP User>
SMTP_PASS=<Your SMTP Password>

# Start the application using Docker
docker-compose up --build
```

### API Documentation

* RESTful API endpoints for user, post, and admin functionalities.
* Testable using API clients like Postman or Insomnia.
* Swagger documentation at: `/api-docs` (if integrated).

## 📂 Project Structure

```
/social-media-platform
├── src
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

## 🚀 Future Improvements

* Real-time notifications using WebSocket.
* Enhanced search and filtering options.
* Improved security with rate limiting.

## 📄 License

Licensed under the MIT License.

## 🙌 Contributions

Contributions are welcome! Please fork the repository and create a pull request.

## 📧 Contact

* Developer: \[Abdelrhman Osama Mostafa Shawky]
* Email: \[abdalrhman.osama.mostafa@gmail.com]
