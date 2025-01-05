document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');

    if (!vehicleId) {
        alert('ID véhicule manquant');
        window.location.href = 'addvehicule.html'; // Redirige vers la page d'ajout si l'ID est manquant
    }

    const marqueInput = document.getElementById('marque');
    const modeleInput = document.getElementById('modele');
    const immatriculationInput = document.getElementById('immatriculation');
    const problemeInput = document.getElementById('probleme');
    const etatSelect = document.getElementById('etat');
    const form = document.getElementById('editVehicleForm');
    const idClientInput = document.getElementById('id_client'); // Assurez-vous qu'il existe dans votre formulaire

    // Charger les données du véhicule
    function loadVehicleData() {
        fetch(`http://localhost:3000/vehicles/${vehicleId}`)
            .then(response => {
                if (!response.ok) {
                    console.error('Erreur API:', response.status, response.statusText);
                    throw new Error('Erreur lors du chargement des données du véhicule.');
                }
                return response.json();
            })
            .then(vehicle => {
                marqueInput.value = vehicle.marque;
                modeleInput.value = vehicle.modele;
                immatriculationInput.value = vehicle.immatriculation;
                problemeInput.value = vehicle.probleme;
                etatSelect.value = vehicle.etat;
                idClientInput.value = vehicle.id_client;  // Assurez-vous que ce champ existe dans la réponse et le formulaire

                // Mettre à jour les données du véhicule
                form.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const marque = marqueInput.value.trim();
                    const modele = modeleInput.value.trim();
                    const immatriculation = immatriculationInput.value.trim();
                    const probleme = problemeInput.value.trim();
                    const etat = etatSelect.value.trim();
                    const idClient = vehicle.id_client;  // Utilisez l'ID du client récupéré de la réponse API

                    // Validation des champs avant l'envoi
                    if (!marque || !modele || !immatriculation || !etat || !idClient) {
                        alert("Tous les champs doivent être remplis !");
                        return;
                    }

                    const data = {
                        marque: marque || "",
                        modele: modele || "",
                        immatriculation: immatriculation || "",
                        probleme: probleme || "",
                        etat: etat || "",
                        id_client: idClient || ""  // Ajoutez ici id_client
                    };

                    console.log("Données envoyées :", data);

                    fetch(`http://localhost:3000/vehicles/${vehicleId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(errMessage => {
                                throw new Error(`Erreur lors de la mise à jour du véhicule. Code: ${response.status}, Message: ${errMessage}`);
                            });
                        }
                        return response.json();
                    })
                    .then(updatedVehicle => {
                        alert('Véhicule mis à jour avec succès');
                        window.location.href = 'addvehicule.html';  // Rediriger vers la page d'ajout après la mise à jour
                    })
                    .catch(error => {
                        console.error('Erreur:', error.message);
                        alert(`Une erreur est survenue : ${error.message}`);
                    });
                });
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur lors du chargement des données du véhicule. Veuillez réessayer plus tard.');
            });
    }

    loadVehicleData();





    // Mettre à jour les données du véhicule
    form.addEventListener('submit', function (e) {
        e.preventDefault();
   
        const marque = marqueInput.value.trim();
        const modele = modeleInput.value.trim();
        const immatriculation = immatriculationInput.value.trim();
        const probleme = problemeInput.value.trim();
        const etat = etatSelect.value.trim();
   
        // Utilisez l'ID du client récupéré de la réponse API
        const idClient = vehicle.id_client; // Ajoutez cette ligne après avoir chargé les données
   
        // Validation des champs avant l'envoi
        if (!marque || !modele || !immatriculation || !etat || !idClient) {
            alert("Tous les champs doivent être remplis !");
            return;
        }
   
        const data = {
            marque: marque || "",
            modele: modele || "",
            immatriculation: immatriculation || "",
            probleme: probleme || "",
            etat: etat || "",
            id_client: idClient || ""  // Ajoutez ici id_client
        };
   
        console.log("Données envoyées :", data);
   
        fetch(`http://localhost:3000/vehicles/${vehicleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errMessage => {
                    throw new Error(`Erreur lors de la mise à jour du véhicule. Code: ${response.status}, Message: ${errMessage}`);
                });
            }
            return response.json();
        })
        .then(updatedVehicle => {
            alert('Véhicule mis à jour avec succès');
            window.location.href = 'addvehicule.html';  // Rediriger vers la page d'ajout après la mise à jour
        })
        .catch(error => {
            console.error('Erreur:', error.message);
            alert(`Une erreur est survenue : ${error.message}`);
        });
    });
   
});
