document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');

    if (!clientId) {
        alert('ID client manquant');
        window.location.href = 'addclients.html';  // Redirige vers la page d'ajout si l'ID est manquant
    }

    const nomInput = document.getElementById('editNom');
    const prenomInput = document.getElementById('editPrenom');
    const telephoneInput = document.getElementById('editTelephone');
    const form = document.getElementById('editClientForm');

    // Charger les données du client
    function loadClientData() {
        fetch(`http://localhost:3000/clients/${clientId}`)
            .then(response => response.json())
            .then(client => {
                nomInput.value = client.nom;
                prenomInput.value = client.prenom;
                telephoneInput.value = client.telephone;
            })
            .catch(error => {
                console.error('Erreur lors du chargement des données :', error);
                alert('Une erreur est survenue lors du chargement des données du client.');
            });
    }

    loadClientData();

    // Mettre à jour les données du client
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nom = nomInput.value;
        const prenom = prenomInput.value;
        const telephone = telephoneInput.value;

        if (!nom || !prenom || !telephone) {
            alert("Tous les champs doivent être remplis !");
            return;
        }

        fetch(`http://localhost:3000/clients/${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom, prenom, telephone })
        })
        .then(response => response.json())
        .then(data => {
            alert('Client mis à jour avec succès');
            window.location.href = 'addclients.html';  // Rediriger vers la page principale
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour du client :', error);
            alert('Une erreur s\'est produite lors de la mise à jour du client.');
        });
    });
});
