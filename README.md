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
 MONGODB_URI=<Your MongoDB URI>
REDIS_URL=<Your Redis URL>
JWT_SECRET=<Your JWT Secret>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
PORT=<Your SMTP Port>


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


## 📄 License

Licensed under the MIT License.

## 🙌 Contributions

Contributions are welcome! Please fork the repository and create a pull request.

## 📧 Contact

* Developer: \[Abdelrhman Osama Mostafa Shawky]
* Email: \[abdalrhman.osama.mostafa@gmail.com]
