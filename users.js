// document.addEventListener('DOMContentLoaded', loadUsers);

// async function loadUsers() {
//   try {
//     const response = await fetch('http://localhost:4500/users/usernames');
//     const users = await response.json();
    
//     if (Array.isArray(users)) {
//       const usernamesList = document.getElementById('usernames-list');
//       usernamesList.innerHTML = '';
//       users.forEach(user => {
//         const listItem = document.createElement('li');
//         listItem.textContent = user.username;
//         usernamesList.appendChild(listItem);
//       });
//     } else {
//       console.error('Unexpected response format:', users);
//     }
//   } catch (error) {
//     console.error('Error fetching users:', error);
//   }
// }
