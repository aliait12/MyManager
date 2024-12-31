const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

if (!userId) {
    alert('ID utilisateur manquant');
    window.location.href = 'Gestion des utilisateurs.html';  // Redirigez vers la page principale si aucun ID n'est fourni
}

document.addEventListener('DOMContentLoaded', function() {
    // Charger les informations de l'utilisateur au chargement de la page
    fetch(`http://localhost:3000/users/${userId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        return response.json();
    })
    .then(user => {
        document.getElementById('username').value = user.username;
        document.getElementById('password').value = user.password;
        document.getElementById('role').value = user.role;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données :', error);
    });


    // Gestion du formulaire
    document.getElementById('editUserForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        if (!username || !password || !role) {
            alert("Tous les champs doivent être remplis !");
            return;
        }

        // Mettre à jour l'utilisateur
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Utilisateur mis à jour avec succès.');
            window.location.href = 'Gestion des utilisateurs.html';  // Redirigez vers la page principale après la mise à jour
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour :', error);
            alert('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur.');
        });
    });
});
