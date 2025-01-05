document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const repairId = urlParams.get('id');

    if (!repairId) {
        alert('ID réparation manquant');
        window.location.href = 'addreparation.html';
        return;
    }

    const descriptionInput = document.getElementById('editDescription');
    const costInput = document.getElementById('editCost');
    const repairDateInput = document.getElementById('editRepairDate');
    const statusSelect = document.getElementById('editStatus');
    const vehicleSelect = document.getElementById('editIdVehicule');
    const form = document.getElementById('editRepairForm');

    // Charger les véhicules
    function loadVehicles() {
        fetch('http://localhost:3000/vehicles')
            .then(response => response.json())
            .then(vehicles => {
                vehicles.forEach(vehicle => {
                    const option = document.createElement('option');
                    option.value = vehicle.id_vehicule; // Assurez-vous d'utiliser le bon champ ID
                    option.textContent = `${vehicle.marque} (${vehicle.modele})`;
                    vehicleSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement des véhicules :', error);
                alert('Erreur lors du chargement des véhicules.');
            });
    }

    // Charger les données de la réparation
    function loadRepairData() {
        fetch(`http://localhost:3000/repairs/${repairId}`)
            .then(response => response.json())
            .then(repair => {
                descriptionInput.value = repair.description;
                costInput.value = repair.cost;
                repairDateInput.value = repair.repair_date.split('T')[0];
                statusSelect.value = repair.status;
                vehicleSelect.value = repair.id_vehicule;
            })
            .catch(error => {
                console.error('Erreur lors du chargement des données :', error);
                alert('Erreur lors du chargement des données de la réparation.');
            });
    }

    loadVehicles();
    loadRepairData();

    // Mettre à jour les données de la réparation
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const description = descriptionInput.value;
        const cost = parseFloat(costInput.value);
        const repairDate = repairDateInput.value;
        const status = statusSelect.value;
        const vehicleId = vehicleSelect.value;

        if (!description || isNaN(cost) || cost <= 0 || !repairDate || !status || !vehicleId) {
            alert('Tous les champs doivent être remplis et valides.');
            return;
        }

        const updatedRepair = {
            description,
            cost,
            repair_date: repairDate,
            status,
            id_vehicule: vehicleId
        };

        fetch(`http://localhost:3000/repairs/${repairId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRepair)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Erreur lors de la mise à jour');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || 'Réparation mise à jour avec succès');
                window.location.href = 'addreparation.html';
            })
            .catch(error => {
                console.error('Erreur de mise à jour de la réparation :', error);
                alert('Erreur lors de la mise à jour de la réparation.');
            });
    });
});
