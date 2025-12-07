# Technical README: User Roles & Authorization

## Overview

This document outlines the user roles and authorization mechanisms implemented in this application. The system is designed to be robust and scalable, clearly separating concerns between different user types at both the backend and frontend levels.

We use JSON Web Tokens (JWT) for stateless authentication. Upon successful login (`/api/auth/login`), the `authController.js` generates a token containing the user's ID, role, and other relevant metadata. This token must be sent in the `Authorization` header as a Bearer token for all subsequent authenticated requests.

## Authorization Layers

### Backend Middleware

The backend (`/backend`) employs a chain of Express middleware to protect API endpoints.

1.  **`middleware/authMiddleware.js` (`protect`)**: This is the primary gatekeeper. It validates the JWT from the `Authorization` header. If the token is valid, it decodes the payload and attaches the user object (containing `_id` and `role`) to the `req` object (`req.user`). If the token is missing or invalid, it returns a `401 Unauthorized` error.

2.  **`middleware/clientMiddleware.js` (`isCliente`)**: This middleware checks if `req.user.role === 'cliente'`. It's used to ensure that only authenticated clients can access certain resources, like their shopping cart or profile.

3.  **`middleware/adminMiddleware.js` (`isAdmin`)**: This middleware checks if `req.user.role === 'admin'`. It gates access to administrative endpoints for managing products, services, and potentially other users.

### Frontend Protected Routes

The frontend (`/frontend`) uses a higher-order component, **`components/ProtectedRoute.js`**, to manage view-level access. This component wraps routes in `App.js` and checks the current user's role (stored in `context/AuthContext.js`) against a list of `allowedRoles`. If the user's role is not in the allowed list, they are redirected, typically to the login page or a "not found" page.

---

## Role Definitions

### 1. Public (Unauthenticated User)

This is the default state for any visitor who has not logged in.

-   **Identification**: No `Authorization` header or an invalid token.
-   **Backend Access**: Limited to public `GET` endpoints, which are configured to not require any authentication middleware.
    -   `GET /api/products`
    -   `GET /api/products/:id`
    -   `GET /api/services`
    -   `GET /api/services/:id`
    -   `POST /api/auth/login`
    -   `POST /api/auth/register`
-   **Frontend Access**: Can only access public-facing pages.
    -   `/` (Home)
    -   `/products`, `/products/:id`
    -   `/services`, `/services/:id`
    -   `/login`, `/register`

### 2. Client (`cliente`)

This is the standard authenticated user role for customers.

-   **Identification**: Valid JWT with a payload containing `role: 'cliente'`.
-   **Backend Access**: Inherits all public access, plus access to routes protected by `protect` and `isCliente`.
    -   **Cart**: `GET, POST /api/cart`, `PUT, DELETE /api/cart/items/:productId`
    -   **Orders**: `GET, POST /api/orders`
    -   **Profile**: `GET, PUT /api/profile`
    -   **Quotes**: `POST /api/quote`
-   **Frontend Access**: Inherits all public pages, plus access to their personal dashboard and actions.
    -   `/dashboard`
    -   `/profile`
    -   `/checkout`
    -   `/quote/:serviceId`

### 3. Admin (`admin`)

This role has elevated privileges for managing the platform's content.

-   **Identification**: Valid JWT with a payload containing `role: 'admin'`.
-   **Backend Access**: Inherits all Client access, plus access to routes protected by `protect` and `isAdmin`. This role effectively has super-user access to the API.
    -   **Product Management**: `POST, PUT, DELETE /api/products/:id`
    -   **Service Management**: `POST, PUT, DELETE /api/services/:id`
    -   *(Note: Admins can also perform client actions like adding to a cart, but this is typically not part of their workflow.)*
-   **Frontend Access**: Inherits all Client pages, plus access to the administration panels.
    -   `/admin-panel`
    -   `/admin-products`
    -   `/admin-services`
