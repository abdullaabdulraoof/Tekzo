Tekzo – Full Stack E-Commerce Platform
Overview
Tekzo is a full-stack e-commerce application developed using the MERN stack (MongoDB,
Express.js, React, Node.js).
It delivers a complete shopping experience with user and admin functionality, secure authentication,
and integrated payment processing.
The project also includes Postman collections for API testing.
Key Features
User Features
- Secure signup, login, and logout with JWT authentication.
- Google OAuth login integration.
- User account management (update profile, email, address).
- Support for default and multiple addresses.
- Browse products with:
• Search by product name or brand.
• Category filters (Audio, Wearables, Laptop, Accessories, PC, Mobiles).
• Sorting options (Newest, Price High → Low, Price Low → High).
• Pagination for product listing.
- Product detail pages with images, pricing, and brand information.
- Cart functionality:
• Add/remove items.
• Adjust quantities dynamically.
- Wishlist functionality with add/remove toggle.
- Order placement with:
• Cash on Delivery (COD).
• Razorpay integration for online payments.
- Secure payment verification using Razorpay signatures.
- Automatic cart clearance after successful payments.
- Order history with product details.
Admin Features
- Admin authentication with JWT.
- Product management:
• Add, edit, and delete products.
• Manage product categories.
- User management:
• View registered users.
• Manage user roles.
- Order management:
• View all orders.
• Update order status (Pending, Placed, Shipped, Delivered).
- Dashboard overview of users, products, and orders.
Technology Stack
Frontend
- React.js with React Router for navigation.
- Axios for API communication.
- Tailwind CSS for responsive design.
- FontAwesome and LordIcon for UI enhancements.
Backend
- Node.js with Express.js framework.
- MongoDB with Mongoose ODM.
- JWT for authentication and authorization.
- bcrypt.js for password encryption.
- Razorpay API for payment processing.
- Google OAuth2 integration for social login.
Testing
- Postman collections included for API testing:
• User.postman_collection.json
• Admin.postman_collection.json
Project Structure
Tekzo/
■■■ Backend/ # Express.js + MongoDB backend services
■ ■■■ model/ # Data models (User, Product, Cart, Wishlist, Order)
■ ■■■ controller/ # Controllers for business logic
■ ■■■ util/ # Utility functions (Google OAuth config)
■ ■■■ routes/ # API route definitions
■ ■■■ server.js # Application entry point
■
■■■ Frontend/ # React.js frontend application
■ ■■■ src/
■ ■ ■■■ components/ # Reusable UI components
■ ■ ■■■ pages/ # User pages (Products, Cart, Checkout, Wishlist, Orders)
■ ■ ■■■ admin/ # Admin dashboard and management pages
■ ■ ■■■ context/ # React context (CartContext)
■ ■ ■■■ App.js
■
■■■ User.postman_collection.json # Postman collection for user APIs
■■■ Admin.postman_collection.json # Postman collection for admin APIs
Sample API Endpoints
User APIs
POST /api/signup
POST /api/login
GET /api/logout
GET /api/google-login
GET /api/products
GET /api/products/:id
POST /api/cart
GET /api/cart
DELETE /api/cart/:id
PUT /api/cart/quantity
POST /api/wishlist
GET /api/wishlist
POST /api/orders
GET /api/orders
POST /api/payment/verify
Admin APIs
POST /api/admin/login
POST /api/admin/add-product
PUT /api/admin/edit-product/:id
DELETE /api/admin/delete-product/:id
GET /api/admin/users
GET /api/admin/orders
PUT /api/admin/orders/:id
Environment Configuration
A .env file should be created inside the Backend directory with the following variables:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
Setup Instructions
Backend
cd Backend
npm install
npm start
Frontend
cd Frontend
npm install
npm start
Testing APIs
1. Import the provided Postman collections:
• User.postman_collection.json
• Admin.postman_collection.json
2. Test all endpoints including authentication, products, cart, wishlist, orders, and admin functions.
Future Enhancements
- Advanced admin analytics including sales reports and revenue tracking.
- Stock and inventory management.
- Discount codes and promotional campaigns.
- Email notifications on order placement and status updates.
- Cloud storage integration for product image hosting.
Author
Abdulla Abdul Raoof
Full Stack Developer | MERN Stack | AI/ML Enthusiast
