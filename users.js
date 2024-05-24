document.addEventListener('DOMContentLoaded', () => {
    fetchUsers('user-list');
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
  });
  
  async function fetchUsers(elementId) {
    try {
      const response = await fetch('http://localhost:4500/users');
      const users = await response.json();
      
      const userList = document.getElementById(elementId);
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
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const user = {
      username,
      email,
      password
    };
  
    try {
      const response = await fetch('http://localhost:4500/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
  
      if (response.ok) {
        alert('User signed up successfully!');
        fetchUsers('user-list'); // Refresh the user list
        document.getElementById('signup-form').reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up. Please try again.');
    }
  }
  