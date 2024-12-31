document.addEventListener('DOMContentLoaded', function () {
    const addClientForm = document.getElementById('addClientForm');

    // Ajouter un client
    addClientForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const telephone = document.getElementById('telephone').value;

        if (!nom || !prenom || !telephone) {
            alert("Tous les champs doivent être remplis !");
            return;
        }

        fetch('http://localhost:3000/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom, prenom, telephone })
        })
        .then(response => response.json())
        .then(data => {
            alert('Client ajouté avec succès');
            loadClients(); // Recharge la liste des clients
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du client :', error);
            alert('Une erreur est survenue lors de l\'ajout du client.');
        });
    });

    // Charger la liste des clients
    function loadClients() {
        fetch('http://localhost:3000/clients')
            .then(response => response.json())
            .then(clients => {
                const clientList = document.getElementById('clientList');
                clientList.innerHTML = '';

                clients.forEach(client => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${client.nom}</td>
                        <td>${client.prenom}</td>
                        <td>${client.telephone}</td>
                        <td>
       <button onclick="window.location.href='editClient.html?id=${client.id_client}'">Modifier</button>

                            <button onclick="deleteClient(${client.id_client})">Supprimer</button>
                        </td>
                    `;
                    clientList.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement des clients :', error);
            });
    }

    loadClients(); // Charger les clients au démarrage
});

// Suppression d'un client
function deleteClient(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        fetch(`http://localhost:3000/clients/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Client supprimé avec succès');
            location.reload(); // Recharger la page pour mettre à jour la liste des clients
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du client :', error);
            alert('Une erreur est survenue lors de la suppression du client.');
        });
    }
}
