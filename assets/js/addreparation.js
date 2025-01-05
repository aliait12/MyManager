const REPAIR_API_URL = "http://localhost:3000/repairs";
const VEHICLES_API_URL = "http://localhost:3000/vehicles";

let vehiclesMap = {};

// Charger les véhicules pour la liste déroulante
function fetchVehicles() {
  fetch(VEHICLES_API_URL)
    .then(response => response.json())
    .then(data => {
      vehiclesMap = data.reduce((map, vehicle) => {
        map[vehicle.id_vehicule] = `${vehicle.marque} ${vehicle.modele} (${vehicle.immatriculation})`;
        return map;
      }, {});

      const vehicleSelect = document.getElementById("id_vehicule");
      data.forEach(vehicle => {
        const option = document.createElement("option");
        option.value = vehicle.id_vehicule;
        option.textContent = vehiclesMap[vehicle.id_vehicule];
        vehicleSelect.appendChild(option);
      });

      fetchRepairs(); // Charger les réparations après avoir chargé les véhicules
    })
    .catch(error => console.error("Erreur lors de la récupération des véhicules :", error));
}

// Charger les réparations
function fetchRepairs() {
  fetch(REPAIR_API_URL)
    .then(response => response.json())
    .then(data => displayRepairs(data))
    .catch(error => console.error("Erreur lors de la récupération des réparations :", error));
}

// Afficher les réparations dans le tableau
function displayRepairs(repairs) {
  const repairList = document.getElementById("repairList");
  repairList.innerHTML = ""; // Vide la liste avant d'ajouter les réparations

  repairs.forEach(repair => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${vehiclesMap[repair.id_vehicule] || "Véhicule inconnu"}</td>
      <td>${repair.description}</td>
      <td>${repair.cost.toFixed(2)} €</td>
      <td>${repair.repair_date}</td>
      <td>${repair.status}</td>
      <td>
        <button onclick="deleteRepair(${repair.id})">Supprimer</button>
        <button onclick="window.location.href='editreparation.html?id=${repair.id}'">Modifier</button>
      </td>
    `;

    repairList.appendChild(row);
  });
}

// Ajouter une réparation
function addRepair(event) {
  event.preventDefault();

  const newRepair = {
    id_vehicule: document.getElementById("id_vehicule").value,
    description: document.getElementById("description").value,
    cost: parseFloat(document.getElementById("cost").value),  // Convertir en nombre
    repair_date: document.getElementById("repair_date").value,
    status: document.getElementById("status").value,
  };

  // Validation des données avant envoi
  if (isNaN(newRepair.cost) || newRepair.cost <= 0) {
    alert("Le coût doit être un nombre valide et supérieur à zéro.");
    return;
  }

  fetch(REPAIR_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRepair),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la réparation");
      }
      return response.json();
    })
    .then(() => {
      fetchRepairs(); // Recharger les réparations
      document.getElementById("addRepairForm").reset(); // Réinitialiser le formulaire
      alert("Réparation ajoutée avec succès !");
    })
    .catch(error => console.error("Erreur lors de l'ajout de la réparation :", error));
}

// Supprimer une réparation
function deleteRepair(id) {
  fetch(`${REPAIR_API_URL}/${id}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Réparation supprimée avec succès') {
        alert('Réparation supprimée avec succès');
        fetchRepairs(); // Recharger les réparations après suppression
      } else {
        alert('Erreur lors de la suppression de la réparation');
        console.error('Erreur:', data.message);
      }
    })
    .catch(error => console.error('Erreur de suppression:', error));
}

// Initialisation
document.getElementById("addRepairForm").addEventListener("submit", addRepair);
fetchVehicles();
