# Support Ticket Management API

A backend REST API for a company helpdesk system built with **Node.js**, **Express**, and **MongoDB**.

---

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt Password Hashing

---

## Setup & Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

The `.env` file is already included with the following variables:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=10
```

### 3. Seed the database (creates roles + default MANAGER account)

```bash
node seed.js
```

Default MANAGER credentials:

```
Email:    manager@company.com
Password: Manager@123
```

### 4. Start the server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint                | Roles                                         |
| ------ | ----------------------- | --------------------------------------------- |
| POST   | `/auth/login`           | Public                                        |
| POST   | `/users`                | MANAGER                                       |
| GET    | `/users`                | MANAGER                                       |
| POST   | `/tickets`              | USER, MANAGER                                 |
| GET    | `/tickets`              | MANAGER (all), SUPPORT (assigned), USER (own) |
| PATCH  | `/tickets/:id/assign`   | MANAGER, SUPPORT                              |
| DELETE | `/tickets/:id`          | MANAGER                                       |
| POST   | `/tickets/:id/comments` | MANAGER, SUPPORT (assigned), USER (owner)     |
| GET    | `/tickets/:id/comments` | MANAGER, SUPPORT (assigned), USER (owner)     |
| PATCH  | `/comments/:id`         | MANAGER, comment author                       |
| DELETE | `/comments/:id`         | MANAGER, comment author                       |

---

## Postman Collection

Test all endpoints using the Postman collection:

**[Open in Postman](https://volt-3508613.postman.co/workspace/Product-Store~7a1c9e2d-2e69-491b-870d-761872e7ed24/collection/45709614-44edda37-e270-4fc5-8919-c5ca0acca89c?action=share&creator=45709614)**

Or import the file `Support Ticket Management API.postman_collection.json` directly into Postman.

---

## Testing Flow

1. `POST /auth/login` with manager credentials → copy the token
2. Set `Authorization: Bearer <token>` header on all subsequent requests
3. Use `POST /users` to create SUPPORT and USER accounts
4. Login with those accounts to get their tokens and test role-specific flows
