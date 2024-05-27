async function loadMovies() {
    try {
      const response = await fetch('http://localhost:4500/movies');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const movies = await response.json();
      console.log('Fetched movies:', movies);
  
      const content = document.getElementById('content');
      if (!content) {
        console.error('Element with id "content" not found.');
        return;
      }
      content.innerHTML = ''; // Clear existing content
  
      const movieTitleDropdown = document.getElementById('movieTitle');
      if (movieTitleDropdown) {
        movieTitleDropdown.innerHTML = ''; // Clear existing options
      }
  
      for (const movie of movies) {
        console.log('Processing movie:', movie);
  
        const title = movie?.title || 'Title not available';
        const director = movie?.director || 'Director not available';
        const writers = movie?.writers ? movie.writers.join(', ') : 'N/A';
        const stars = movie?.stars ? movie.stars.join(', ') : 'N/A';
        const releaseYear = movie?.releaseYear || 'Release year not available';
        const genre = movie?.genre || 'Genre not available';
        const description = movie?.description || 'Description not available';
        const imageUrl = movie?.imageUrl || '';
        const imdbUrl = movie?.imdbUrl || '';
  
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card');
        movieElement.innerHTML = `
          <h2>${title}</h2>
          <p><strong>Director:</strong> ${director}</p>
          <p><strong>Writers:</strong> ${writers}</p>
          <p><strong>Stars:</strong> ${stars}</p>
          <p><strong>Release Year:</strong> ${releaseYear}</p>
          <p><strong>Genre:</strong> ${genre}</p>
          <p><strong>Description:</strong> ${description}</p>
          ${imageUrl ? `<img src="${imageUrl}" alt="${title} Cover Art" />` : ''}
          ${imdbUrl ? `<p><a href="${imdbUrl}" target="_blank">IMDb</a></p>` : ''}
          <div class="reviews" id="reviews-${movie._id}" style="display: none;"><h3>Reviews</h3></div>
          <div class="buttons">
            <button onclick="toggleReviews('${movie._id}')">View Reviews</button>
            <button onclick="toggleWriteReviewForm('${movie._id}')">Write Review</button>
          </div>
          <div class="write-review" id="write-review-${movie._id}" style="display: none;">
            <form class="review-form" id="review-form-${movie._id}" onsubmit="handleAddReview(event, '${movie._id}')">
              <input type="text" id="author-${movie._id}" placeholder="Author" required />
              <input type="number" id="rating-${movie._id}" placeholder="Rating" required min="1" max="5" />
              <textarea id="comment-${movie._id}" placeholder="Comment" required></textarea>
              <button type="submit">Add Review</button>
            </form>
          </div>
        `;
        content.appendChild(movieElement);
  
        // Populate movie title dropdown if it exists
        if (movieTitleDropdown) {
          const option = document.createElement('option');
          option.value = movie._id;
          option.textContent = movie.title;
          movieTitleDropdown.appendChild(option);
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }
  
  async function loadReviews(movieId) {
    try {
      console.log('Fetching reviews for movieId:', movieId);
      const response = await fetch(`http://localhost:4500/reviews?movieId=${movieId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const reviews = await response.json();
      console.log('Fetched reviews for movie:', movieId, reviews);
  
      const reviewsElement = document.getElementById(`reviews-${movieId}`);
      if (!reviewsElement) {
        console.error('Element with id reviews-' + movieId + ' not found.');
        return;
      }
      reviewsElement.innerHTML = ''; // Clear previous reviews
      if (reviews.length === 0) {
        reviewsElement.innerHTML += '<p>No reviews available</p>';
      } else {
        reviews.forEach((review, index) => {
          const reviewElement = document.createElement('div');
          reviewElement.classList.add('review');
          reviewElement.innerHTML = `
            <p><strong>Username:</strong> ${review.author}</p>
            <p><strong>Rating:</strong> ${review.rating}</p>
            <p><strong>Comment:</strong> ${review.comment}</p>
          `;
          reviewsElement.appendChild(reviewElement);
  
          // Add a styled divider between reviews
          if (index < reviews.length - 1) {
            const divider = document.createElement('hr');
            divider.classList.add('custom-divider');
            reviewsElement.appendChild(divider);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }
  
  async function fetchReviews(elementId) {
    try {
      const response = await fetch('http://localhost:4500/reviews');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const reviews = await response.json();
      const reviewList = document.getElementById(elementId);
      if (!reviewList) {
        console.error('Element with id ' + elementId + ' not found.');
        return;
      }
      reviewList.innerHTML = ''; // Clear the list before adding new elements
      reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
          <h4>${review.movieId.title}</h4>
          <div class="review-details">
            <span><i class="fas fa-user"></i> ${review.author}</span>
            <span><i class="fas fa-star"></i> ${review.rating}</span>
          </div>
          <p>${review.comment}</p>
        `;
        reviewList.appendChild(reviewCard);
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }
  
  async function handleAddReview(event, movieId) {
    event.preventDefault();
  
    const review = {
      movieId: movieId,
      author: document.getElementById(`author-${movieId}`).value,
      rating: parseInt(document.getElementById(`rating-${movieId}`).value, 10),
      comment: document.getElementById(`comment-${movieId}`).value
    };
  
    try {
      const response = await fetch('http://localhost:4500/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      console.log('Review added:', data);
      toggleWriteReviewForm(movieId); // Hide the form after adding the review
      loadReviews(movieId); // Refresh the reviews for the movie
    } catch (error) {
      console.error('Error adding review:', error);
    }
  }
  
  async function handleAddMovie(event) {
    event.preventDefault();
  
    const movie = {
      title: document.getElementById('title').value,
      director: document.getElementById('director').value,
      writers: document.getElementById('writers').value.split(',').map(writer => writer.trim()),
      stars: document.getElementById('stars').value.split(',').map(star => star.trim()),
      releaseYear: parseInt(document.getElementById('releaseYear').value, 10),
      genre: document.getElementById('genre').value,
      description: document.getElementById('description').value,
      imageUrl: document.getElementById('imageUrl').value // Ensure imageUrl field is included
    };
  
    try {
      const response = await fetch('http://localhost:4500/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      console.log('Movie added:', data);
      loadMovies(); // Refresh the movie list
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  }
  
  async function fetchUsers(elementId) {
    try {
      const response = await fetch('http://localhost:4500/users');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const users = await response.json();
      const userList = document.getElementById(elementId);
      if (!userList) {
        console.error('Element with id ' + elementId + ' not found.');
        return;
      }
      userList.innerHTML = ''; // Clear the list before adding new elements
      users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
          <h3>${user.username}</h3>
          <p>Email: ${user.email}</p>
        `;
        userList.appendChild(userCard);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  
  async function handleSignup(event) {
    event.preventDefault();
  
    const user = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
  
    try {
      const response = await fetch('http://localhost:4500/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      console.log('User added:', data);
      fetchUsers('user-list'); // Refresh the user list
      document.getElementById('signup-form').reset(); // Clear the form
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }
  
  function toggleReviews(movieId) {
    const reviewsElement = document.getElementById(`reviews-${movieId}`);
    if (reviewsElement) {
      if (reviewsElement.style.display === 'none') {
        reviewsElement.style.display = 'block';
        loadReviews(movieId); // Load reviews only when they are displayed
      } else {
        reviewsElement.style.display = 'none';
      }
    } else {
      console.error('Element with id reviews-' + movieId + ' not found.');
    }
  }
  
  function toggleWriteReviewForm(movieId) {
    const writeReviewElement = document.getElementById(`write-review-${movieId}`);
    if (writeReviewElement) {
      writeReviewElement.style.display = writeReviewElement.style.display === 'none' ? 'block' : 'none';
    } else {
      console.error('Element with id write-review-' + movieId + ' not found.');
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // Check if the current page is the reviews page
    const reviewListElement = document.getElementById('review-list');
    if (reviewListElement) {
      fetchReviews('review-list');
    }
  
    // Check if the current page is the movies page
    const movieListElement = document.getElementById('content');
    if (movieListElement) {
      loadMovies();
    }
  
    // Check if the current page is the users page
    const userListElement = document.getElementById('user-list');
    if (userListElement) {
      fetchUsers('user-list');
    }
  
    // Add event listeners to forms
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', handleAddReview);
    }
  
    const movieForm = document.getElementById('movie-form');
    if (movieForm) {
      movieForm.addEventListener('submit', handleAddMovie);
    }
  
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', handleSignup);
    }
  });
  