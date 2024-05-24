async function loadMovies() {
    try {
      const response = await fetch('http://localhost:4500/movies');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const movies = await response.json();
      console.log('Fetched movies:', movies);
  
      const content = document.getElementById('content');
      content.innerHTML = ''; // Clear existing content
  
      const movieTitleDropdown = document.getElementById('movieTitle');
      movieTitleDropdown.innerHTML = ''; // Clear existing options
  
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
          <p>Director: ${director}</p>
          <p>Writers: ${writers}</p>
          <p>Stars: ${stars}</p>
          <p>Release Year: ${releaseYear}</p>
          <p>Genre: ${genre}</p>
          <p>Description: ${description}</p>
          ${imageUrl ? `<img src="${imageUrl}" alt="${title} Cover Art" />` : ''}
          ${imdbUrl ? `<p><a href="${imdbUrl}" target="_blank">IMDb</a></p>` : ''}
          <div class="reviews" id="reviews-${movie._id}"><h3>Reviews</h3></div>
        `;
        content.appendChild(movieElement);
        await loadReviews(movie._id);
  
        // Populate movie title dropdown
        const option = document.createElement('option');
        option.value = movie._id;
        option.textContent = movie.title;
        movieTitleDropdown.appendChild(option);
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
      if (reviews.length === 0) {
        reviewsElement.innerHTML += '<p>No reviews available</p>';
      } else {
        reviews.forEach(review => {
          const reviewElement = document.createElement('div');
          reviewElement.classList.add('review-card');
          reviewElement.innerHTML = `
            <p>Author: ${review.author}</p>
            <p>Rating: ${review.rating}</p>
            <p>Comment: ${review.comment}</p>
          `;
          reviewsElement.appendChild(reviewElement);
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadMovies);
  
  document.getElementById('review-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = event.target;
    const movieId = form.movieTitle.value;
    const author = form.author.value;
    const rating = form.rating.value;
    const comment = form.comment.value;
  
    const review = {
      movieId,
      author,
      rating,
      comment
    };
  
    try {
      const response = await fetch('http://localhost:4500/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
  
      const result = await response.json();
      console.log('Review submitted:', result);
  
      // Clear form fields
      form.reset();
  
      // Reload reviews for the selected movie
      await loadReviews(movieId);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  });
  
  document.getElementById('movie-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = event.target;
    const title = form.title.value;
    const director = form.director.value;
    const writers = form.writers.value.split(',').map(writer => writer.trim());
    const stars = form.stars.value.split(',').map(star => star.trim());
    const releaseYear = form.releaseYear.value;
    const genre = form.genre.value;
    const description = form.description.value;
    const imageUrl = form.imageUrl.value;
    const imdbUrl = form.imdbUrl.value;
  
    const movie = {
      title,
      director,
      writers,
      stars,
      releaseYear,
      genre,
      description,
      imageUrl,
      imdbUrl
    };
  
    try {
      const response = await fetch('http://localhost:4500/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
  
      const result = await response.json();
      console.log('Movie submitted:', result);
  
      // Clear form fields
      form.reset();
  
      // Reload movies
      await loadMovies();
    } catch (error) {
      console.error('Error submitting movie:', error);
    }
  });
  