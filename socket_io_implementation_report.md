# Real-Time Synchronization Report (Socket.io)

This document details the implementation of real-time data synchronization across the Tekzo platform using Socket.io.

## 🔌 Overview
The goal was to eliminate manual page refreshes when data changes (e.g., when an admin adds a product or a user updates their cart). We implemented a **Push-Based Architecture** where the server notifies clients of mutations instantly.

---

## 🏗️ Technical Architecture

### 1. Backend (Node.js/Express)
- **Engine**: `socket.io`
- **Server Wrapper**: Refactored `server.js` to use `http.createServer(app)` to allow WebSockets to share the same port as the API.
- **Utility**: Created `Backend/utils/socket.js` to provide a singleton `io` instance accessible by all controllers.

### 2. Frontend (React)
- **Engine**: `socket.io-client`
- **Context API**: Created `Frontend/context/SocketContext.jsx` to manage the persistent connection and provide the `socket` instance via a custom hook `useSocket()`.
- **Global Provider**: Wrapped the entire application in `SocketProvider` within `main.jsx`.

---

## 📡 Implemented Event Triggers

The system now emits specific events during database mutations:

| Event Name | Trigger Location | Purpose |
| :--- | :--- | :--- |
| `productChanged` | `adminController.js` | Refreshes product lists and deals for all users. |
| `cartUpdated` | `userController.js` | Syncs cart count and items across all user tabs. |
| `orderPlaced` | `userController.js` | Updates order history and clears cart in real-time. |
| `orderStatusChanged` | `adminController.js` | Notifies user instantly when their order status is updated. |
| `profileUpdated` | `userController.js` | Refreshes account info and shipping addresses. |
| `wishlistUpdated` | `userController.js` | Keeps wishlist status consistent across devices. |

---

## 🛠️ Components Integrated

The following frontend components now listen for these events and trigger automatic data re-fetching:

- **Home (`PostCard.jsx`)**: Refreshes "Trending Deals" and "Best Sellers".
- **Products (`ProductList.jsx`)**: Updates inventory and pricing.
- **Orders (`Order.jsx`)**: Refreshes status and list.
- **Account (`AccountDetails.jsx`)**: Syncs personal information.
- **Wishlist (`Wishlist.jsx`)**: Syncs favorites.
- **ChatBox (`ChatBox.jsx`)**: Automatically updates AI context so the bot knows the current cart/order state.
- **Cart Context (`CartContext.jsx`)**: Synchronizes global cart count and totals.

---

## 📂 Files Modified/Created

### Backend
- `Backend/server.js` (Server Refactoring)
- `Backend/utils/socket.js` (New Utility)
- `Backend/controller/adminController.js` (Event Emission)
- `Backend/controller/userController.js` (Event Emission)

### Frontend
- `Frontend/context/SocketContext.jsx` (New Provider)
- `Frontend/context/CartContext.jsx` (Integrated Listener)
- `Frontend/src/main.jsx` (Global Setup)
- `Frontend/src/User/components/PostCard.jsx`
- `Frontend/src/User/features/products/ProductList.jsx`
- `Frontend/src/User/features/Account/Order.jsx`
- `Frontend/src/User/features/Account/Wishlist.jsx`
- `Frontend/src/User/features/Account/AccountDetails.jsx`
- `Frontend/src/User/components/ChatBox.jsx`

---
*Status: Implementation Complete & Paths Verified*
