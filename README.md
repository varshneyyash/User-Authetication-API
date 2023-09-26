# User Authentication API

This is a simple Node.js authentication API using Express, JWT (JSON Web Tokens), Bcrypt for password hashing, and Nodemailer for sending password reset emails.

## Libraries Used

- [Express](https://expressjs.com/): A fast, unopinionated, minimalist web framework for Node.js.
- [Body Parser](https://www.npmjs.com/package/body-parser): Middleware to parse incoming request bodies.
- [JSON Web Tokens (JWT)](https://jwt.io/): Used for authentication and creating secure tokens.
- [Bcrypt](https://www.npmjs.com/package/bcrypt): A library for securely hashing passwords.
- [Nodemailer](https://nodemailer.com/): A library for sending email.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Register a User](###register-a-user)
  - [Login](###login)
  - [Forgot Password](###forgot-password)
  - [Update User Information (Protected)](###update-user-information-protected)
  - [Delete User (Protected)](###delete-user-protected)
  - [Get All Users (Protected)](###get-all-users-protected)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [LICENSE](#license)

## Installation

1. Clone the repository:

- git clone [User-Authetication-API](https://github.com/varshneyyash/User-Authetication-API)
- cd user-authentication-api/assignment

2. Install the required libraries:

    npm install

3. Configure your Gmail credentials for Nodemailer:

- Open index.js in your code editor.
- Locate the section where nodemailer.createTransport is used for sending emails.
- Replace 'your-email@gmail.com' and 'your-email-password' with your Gmail email and password (or use environment variables for better security).

4. Configuration

- The JWT secret key is set to 'innovativeRudra'. You can change this in the secretKey variable.

## Usage

### Register a User

     POST http://localhost:3000/register

- Register a new user by sending a POST request to /register.
- Include the username and password in the request body as JSON.

### Login

    POST http://localhost:3000/login

- Authenticate a user by sending a POST request to /login.
- Include the username and password in the request body as JSON.
- Successful authentication returns a JWT token in the response header.

### Forgot Password 

    POST http://localhost:3000/forgot-password

- Simulates the process of sending a password reset email.
- Send a POST request to /forgot-password with the username of the user.
- A password reset token will be generated and "emailed" to the user (console log).

### Update User Information (Protected)

    PATCH http://localhost:3000/users/:username

- Update user information, including the password, by sending a PATCH request to /users/:username.
- The route is protected with JWT authentication. Include the JWT token in the Authorization header.

### Delete User (Protected)

    DELETE http://localhost:3000/users/:username

- Delete a user by sending a DELETE request to /users/:username.
- The route is protected with JWT authentication. Include the JWT token in the Authorization header.

### Get All Users (Protected)

    GET http://localhost:3000/users

- Get a list of all users (excluding passwords) by sending a GET request to /users.
- The route is protected with JWT authentication. Include the JWT token in the Authorization header.

## Running the Server
    
    npm start

- The server will run on port 3000 by default. You can specify a different port using the PORT environment variable.
## [License](LICENSE)

- This project is licensed under the MIT License - see the LICENSE file for details.
