document.addEventListener('DOMContentLoaded', () => {
    fetchUsers('user-list');
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
  