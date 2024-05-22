document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('movies-link').addEventListener('click', loadMovies);
    document.getElementById('users-link').addEventListener('click', loadUsers);
  
    // Load movies by default
    loadMovies();
  });
  
  async function loadMovies() {
    try {
      console.log('Loading movies...');
      const response = await fetch('http://localhost:4000/movies');
      console.log('Movies response:', response);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const movies = await response.json();
      console.log('Movies fetched:', movies);
      const content = document.getElementById('content');
      content.innerHTML = '<h1>Movies</h1>';
      movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
          <h2>${movie.title}</h2>
          <p>Director: ${movie.director}</p>
          <p>Release Year: ${movie.releaseYear}</p>
          <p>Genre: ${movie.genre}</p>
          <div class="reviews" id="reviews-${movie._id}"></div>
        `;
        content.appendChild(movieElement);
        loadReviews(movie._id);
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }
  
  async function loadReviews(movieId) {
    try {
      console.log(`Loading reviews for movie: ${movieId}`);
      const response = await fetch(`http://localhost:4000/reviews?movieId=${movieId}`);
      console.log('Reviews response:', response);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const reviews = await response.json();
      console.log(`Reviews fetched for movie ${movieId}:`, reviews);
      const reviewsContainer = document.getElementById(`reviews-${movieId}`);
      reviewsContainer.innerHTML = '<h3>Reviews</h3>';
      reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `
          <h4>${review.author}</h4>
          <p>Rating: ${review.rating}</p>
          <p>${review.comment}</p>
        `;
        reviewsContainer.appendChild(reviewElement);
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }
  
  async function loadUsers() {
    try {
      console.log('Loading users...');
      const response = await fetch('http://localhost:4000/users');
      console.log('Users response:', response);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const users = await response.json();
      console.log('Users fetched:', users);
      const content = document.getElementById('content');
      content.innerHTML = '<h1>Users</h1>';
      users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('user');
        userElement.innerHTML = `
          <h2>${user.username}</h2>
          <p>Email: ${user.email}</p>
        `;
        content.appendChild(userElement);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  