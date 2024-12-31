// Définir la fonction deleteUser globalement
function deleteUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Utilisateur supprimé avec succès');
            // Optionnel : Recharge ou redirige vers la page après la suppression
            window.location.reload();
        })
        .catch(error => {
            console.error('Erreur lors de la suppression :', error);
            alert('Une erreur s\'est produite lors de la suppression de l\'utilisateur.');
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Sélectionner les éléments
    const addUserForm = document.getElementById('addUserForm');
    const loadUsersButton = document.getElementById('loadUsers');
    const userTable = document.getElementById('userList');

    // Fonction pour charger les utilisateurs
    function loadUsers() {
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(users => {
                const userList = users.map(user => {
                    return ` 
                        <tr>
                            <td>${user.username}</td>
                            <td>${user.role}</td>
                            <td>
                                <button onclick="window.location.href='editUser.html?id=${user.id}'">Modifier</button>
                                <button onclick="deleteUser(${user.id})">Supprimer</button>
                            </td>
                        </tr>
                    `;
                }).join('');
                userTable.innerHTML = userList;
            })
            .catch(error => console.error('Erreur lors du chargement des utilisateurs:', error));
    }

    // Fonction pour ajouter un utilisateur
    addUserForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        if (!username || !password || !role) {
            alert("Tous les champs doivent être remplis !");
            return;
        }

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role })
        })
        .then(response => response.json())
        .then(data => {
            alert('Utilisateur ajouté avec succès');
            loadUsers(); // Rafraîchir la liste des utilisateurs après l'ajout
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
            alert('Erreur lors de l\'ajout de l\'utilisateur');
        });
    });

    // Charger les utilisateurs immédiatement dès le chargement de la page
    loadUsers(); // Les utilisateurs s'affichent immédiatement

    // Optionnel : Recharge la liste des utilisateurs au clic sur le bouton "Afficher les utilisateurs"
    loadUsersButton.addEventListener('click', loadUsers);
});
