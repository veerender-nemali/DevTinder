# DevTinder Backend

A developer networking backend that enables profile management, connection requests, and secure authenticated matchmaking between developer users.

## Features

* User signup, login, and logout
* JWT authentication using secure cookies
* Profile viewing and profile updates
* Send connection requests as `interested` or `ignored`
* Review incoming requests with `accepted` or `rejected`
* Fetch received connection requests and confirmed connections
* Feed generation that excludes users already involved in requests with the current user
* Input validation for signup and profile edits

## Tech Stack

* Backend framework: Express.js
* Database: MongoDB with Mongoose ODM
* Authentication: JSON Web Tokens (JWT) stored in HTTP cookies
* APIs: RESTful endpoints
* Other libraries/tools:
  * `bcrypt` for password hashing
  * `validator` for input validation
  * `cookie-parser` for cookie handling
  * `cors` for cross-origin support
  * `dotenv` for configuration management

## Architecture Overview

The backend follows a simple API server architecture:

* Client sends HTTP request to Express API
* Request passes through middleware for JSON parsing, cookie parsing, CORS, and authentication
* Authenticated routes use `userAuth` middleware to verify JWT and attach `req.user`
* Route handlers perform business logic and database operations
* Mongoose models interact with MongoDB collections
* Responses return JSON data or HTTP errors

Authentication flow:

1. User signs up or logs in
2. Backend creates/verifies user credentials
3. Backend issues a signed JWT token
4. Token is stored in a `token` cookie
5. Protected routes verify the cookie token and authorize user actions

Error handling flow:

* Validation failures and database errors are caught by route handlers
* Errors return HTTP 400 with descriptive messages

## Folder Structure

* `src/app.js` — application entry point and router setup
* `src/config/database.js` — MongoDB connection logic
* `src/middlewares/auth.js` — JWT authentication middleware
* `src/models/user.js` — User schema, password validation, JWT generation
* `src/models/connectionRequest.js` — Connection request schema and business constraints
* `src/routes/auth.js` — signup, login, logout routes
* `src/routes/profile.js` — profile view and edit routes
* `src/routes/request.js` — send and review connection requests
* `src/routes/user.js` — feed, received requests, and connections endpoints
* `src/utils/validation.js` — request validation utilities

## API Endpoints

### Authentication

* `POST /signup`
  * Purpose: Register a new user
  * Request body:
    ```json
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "emailId": "jane@example.com",
      "password": "StrongPassw0rd!",
      "gender": "female",
      "age": 25
    }
    ```
  * Response: saved user data without password

* `POST /login`
  * Purpose: Authenticate existing user
  * Request body:
    ```json
    {
      "emailId": "jane@example.com",
      "password": "StrongPassw0rd!"
    }
    ```
  * Response: user object and sets `token` cookie

* `POST /logout`
  * Purpose: Clear authentication cookie
  * Response: logout confirmation

### Profile

* `GET /profile/view`
  * Purpose: Retrieve authenticated user's profile
  * Response: current user object

* `PATCH /profile/edit`
  * Purpose: Update allowed profile fields
  * Request body example:
    ```json
    {
      "about": "Backend developer",
      "skills": ["Node.js", "MongoDB"]
    }
    ```
  * Response: updated user data

### Connection Requests

* `POST /request/send/:status/:userId`
  * Purpose: Send a connection request or ignore another user
  * Path params:
    * `status`: `interested` or `ignored`
    * `userId`: target user ID
  * Response: saved connection request

* `POST /request/review/:status/:requestId`
  * Purpose: Accept or reject an incoming request
  * Path params:
    * `status`: `accepted` or `rejected`
    * `requestId`: request document ID
  * Response: updated request status

### User Data

* `GET /user/requests/received`
  * Purpose: Fetch incoming requests with status `interested`
  * Response: list of request data with sender profile fields

* `GET /user/connections`
  * Purpose: Fetch confirmed connections
  * Response: list of connected user profiles

* `GET /user/feed`
  * Purpose: Fetch user feed excluding already requested or connected users
  * Query params: `page`, `limit`
  * Response: paginated list of user profiles

## Database Schema

### Collections

* `users`
  * Fields: `firstName`, `lastName`, `emailId`, `password`, `age`, `gender`, `photoUrl`, `about`, `skills`
  * Validation: email format, strong password, required age/gender values

* `connectionrequests`
  * Fields: `fromUserId`, `toUserId`, `status`
  * Status values: `interested`, `ignored`, `accepted`, `rejected`
  * Constraint: requests cannot be created to self
  * Index: compound index on `fromUserId` and `toUserId`

### Relationships

* `ConnectionRequest` documents reference `User` IDs for sender and recipient
* Request status tracks the relationship state between users

## Installation & Setup

1. Clone repository
   ```bash
   git clone <repository-url>
   cd DevTinder
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create `.env`
   ```text
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```
4. Run locally
   ```bash
   npm start
   ```
5. Development mode
   ```bash
   npm run dev
   ```

## Environment Variables

Example `.env` values:

```env
MONGODB_URI=mongodb://username:password@host:port/devTinder?ssl=true&replicaSet=atlas-shard-0&authSource=admin
JWT_SECRET=your-secure-jwt-secret
```

## Security Features

* Password hashing with `bcrypt`
* JWT-based authentication for protected routes
* Secure cookie storage for auth token
* Input validation for signup and profile updates
* Route-level authentication middleware
* CORS restricted to the configured frontend origin

## Deployment

This backend is deployed to : 
* AWS EC2 instance

