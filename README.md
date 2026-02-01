📚 Online Bookstore – Backend

A RESTful backend API for an online bookstore built with Node.js, Express, and MongoDB.
Handles authentication, book management, orders, stock control, and admin operations.

🚀 Tech Stack

Node.js, 
Express.js,
MongoDB + Mongoose,
JWT Authentication,
Multer (image uploads),
bcryptjs,
dotenv

✨ Features

🔐 Authentication & Authorization

User registration & login

JWT-based authentication

Role-based access (admin, customer)

Protected routes

📚 Book Management (Admin)

Add, update, delete books

Upload multiple book images

Edit book descriptions

Remove existing images

View all books


📦 Stock Management

Real-time inventory control

Stock decreases automatically when orders are placed

Prevents orders when stock is insufficient

Supports quantity-based stock deduction

Low-stock detection supported on frontend


🛒 Orders

Customers can place orders

Orders contain multiple books

Order status lifecycle:

   pending,
   shipped,
   delivered
   

Admin can update order status

Users can view their own orders


🖼 Image Handling

Book images uploaded using multer

Images stored in /uploads

Image URLs served statically

Supports both local and external (URL-based) images
