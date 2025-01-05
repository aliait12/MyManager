const API_URL = "http://localhost:3000/vehicles";
const CLIENTS_API_URL = "http://localhost:3000/clients";

// Charger les véhicules au démarrage
function fetchVehicles() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => displayVehicles(data))
        .catch(error => console.error("Erreur lors de la récupération des véhicules :", error));
}

// Afficher les véhicules dans le tableau
function displayVehicles(vehicles) {
    const vehicleList = document.getElementById("vehicleList");
    vehicleList.innerHTML = '';

    vehicles.forEach(vehicle => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${vehicle.marque}</td>
            <td>${vehicle.modele}</td>
            <td>${vehicle.immatriculation}</td>
            <td>${vehicle.probleme}</td>
            <td>${vehicle.etat}</td>
            <td>
                <button onclick="deleteVehicle(${vehicle.id_vehicule})">Supprimer</button>
                <button onclick="window.location.href='editvehicule.html?id=${vehicle.id_vehicule}'">Modifier</button>
            </td>
        `;

        vehicleList.appendChild(row);
    });
}

// Ajouter un véhicule
function addVehicle(event) {
    event.preventDefault();

    const newVehicle = {
        marque: document.getElementById("marque").value,
        modele: document.getElementById("modele").value,
        immatriculation: document.getElementById("immatriculation").value,
        probleme: document.getElementById("probleme").value,
        etat: document.getElementById("etat").value,
        id_client: document.getElementById("clientSelect").value,
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicle),
    })
        .then(response => response.json())
        .then(() => {
            fetchVehicles(); // Recharger les véhicules
            document.getElementById("addVehicleForm").reset(); // Réinitialiser le formulaire
        })
        .catch(error => console.error("Erreur lors de l'ajout du véhicule :", error));
}

// Supprimer un véhicule
function deleteVehicle(id) {
    if (!id) {
        console.error("ID du véhicule non défini");
        return;
    }
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(response => {
            if (response.ok) {
                fetchVehicles(); // Reload the vehicle list
            } else {
                console.error("Erreur lors de la suppression du véhicule :", response);
            }
        })
        .catch(error => console.error("Erreur lors de la suppression du véhicule :", error));
}


// Charger les clients pour la liste déroulante
function fetchClients() {
    fetch(CLIENTS_API_URL)
        .then(response => response.json())
        .then(data => {
            const clientSelect = document.getElementById("clientSelect");
            data.forEach(client => {
                const option = document.createElement("option");
                option.value = client.id_client;
                option.textContent = `${client.nom} ${client.prenom}`;
                clientSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erreur lors de la récupération des clients :", error));
}

// Initialisation
document.getElementById("addVehicleForm").addEventListener("submit", addVehicle);
fetchVehicles();
fetchClients();
