# koach-lambda-be

## Overview
The backend of this project is built with **Express.js**, focusing on secure API communication, efficient data handling, and good coding practices. Key features include **authentication**, **rate limiting**, **CORS handling**, **password hashing**, and **in-memory data storage**. Environment variables are managed via `.env` for maintainability and security.

---

## Key Features

### 1. CORS (Cross-Origin Resource Sharing)
- **CORS** is enabled to control which origins and methods can access the backend.
- Prevents unauthorized requests and allows secure communication between frontend and backend.

---

### 2. Rate Limiting
- Prevents **DDoS attacks** and **API abuse** by limiting the number of requests per IP.
- Example: 100 requests per hour per user.

---

### 3. Password Hashing
- User passwords are securely hashed using **bcrypt** before storing them in the in-memory database.
- This ensures that even if the in-memory database is compromised, passwords remain safe.

---

### 4. Error Handling
- Centralized error handling ensures that all errors are caught and handled gracefully.
- Custom error messages are returned to the frontend for better debugging.

---

### 5. Good Practices
- **Modular code structure**: Routes, controllers, and services are organized for easy maintainability.
- **Secure coding**: Passwords are hashed, and sensitive data is stored securely.
- **Rate limiting**: Protects the backend from excessive requests.

---

### 6. In-Memory Data Storage
- Used for temporary data storage (e.g., tokens) before they are persisted.
- Improves performance by reducing the number of database reads/writes.

---

### 7. Authentication
- **JWT-based authentication** is implemented to ensure secure access to protected routes.
- Tokens are generated during login and stored in the client’s local storage.

---

### 8. Environment Variable Management
- Sensitive information (e.g., API keys, database credentials) is stored in `.env` files.
- This keeps the code clean and prevents accidental exposure of sensitive data.

---

### 9. Token with Static Hashed Value
- A **custom token** concept is introduced. 
- The token stores a **static value** generated from the **hashed username and password**.
- This token allows **consistent user identification** across sessions.
- Using this token, the backend can retrieve the corresponding **user-specific data** from the **S3 bucket**.
- This mechanism ensures fast and secure data access without repeatedly querying for user credentials.

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd koach-lambda-be
