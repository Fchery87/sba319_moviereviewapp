# Movie Critics Review App

## Description

This application allows users to view, add, update, and delete movies and reviews. It also manages user data. The app includes a user-friendly interface for browsing and interacting with movies and reviews, and it supports CRUD operations via RESTful API routes.

## Features

- View a list of movies with detailed information
- View reviews for each movie
- Submit new movies and reviews
- Update and delete existing movies and reviews
- User management for sign-up and viewing user details

## API Routes

### Users

- **GET /users/**: Get all users
- **POST /users/**: Create a new user
- **GET /users/:id**: Get a user by ID
- **PUT /users/:id**: Update a user by ID
- **DELETE /users/:id**: Delete a user by ID

### Movies

- **GET /movies/**: Get all movies
- **POST /movies/**: Create a new movie
- **GET /movies/:id**: Get a movie by ID
- **PUT /movies/:id**: Update a movie by ID
- **DELETE /movies/:id**: Delete a movie by ID

### Reviews

- **GET /reviews/**: Get all reviews or reviews by movieId
- **POST /reviews/**: Create a new review
- **GET /reviews/:id**: Get a review by ID
- **PUT /reviews/:id**: Update a review by ID
- **DELETE /reviews/:id**: Delete a review by ID

## Frontend Pages

### Home Page

- Displays a list of movies.
- Each movie card has a "View Reviews" button to display reviews and a "Write Review" button to submit a new review.

### Movies Page

- Includes a form to submit new movies.
- Displays all movies in a grid format.

### Reviews Page

- Displays all reviews linked with their corresponding movie titles.
- Includes a form to submit new reviews.

### Users Page

- Displays a list of users.
- Includes a form for user sign-up.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fchery87/moviereviewapp.git

   ```

2. Navigate to the project directory:

   ```bash
   cd moviereviewapp

   ```

3. Install the dependencies:

   ```bash
   npm install

   ```

4. Create a .env file in the root of the project and add your MongoDB Atlas URI:

````makefile
ATLAS_URI=your_mongodb_atlas_uri

6. Start the server:
```bash
npm start
Open your browser and navigate to http://localhost:4500.

### Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML
- CSS (Poppins and Montserrat fonts)
- JavaScript

