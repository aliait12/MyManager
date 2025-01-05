// Fonction pour récupérer les données de l'API
function fetchDashboardData() {
  document.getElementById("loadingMessage").style.display = "block"; // Afficher le message de chargement
  fetch("http://localhost:3000/stats")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur HTTP: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // Afficher les données dans la console

      // Mise à jour des éléments dans les cartes avec les données récupérées
      document.getElementById("usersCount").innerText = data.users_count || 0;
      document.getElementById("vehiclesCount").innerText = data.vehicles_count || 0;
      document.getElementById("clientsCount").innerText = data.clients_count || 0;
      document.getElementById("repairsCount").innerText = data.repairs_count || 0;

      // Mise à jour du graphique
      var options = {
        series: [
          { name: "Net Profit", data: data.net_profit || [] }, // Assurez-vous que les données existent
          { name: "Revenue", data: data.revenue || [] },
          { name: "Free Cash Flow", data: data.free_cash_flow || [] },
        ],
        chart: {
          type: "bar",
          height: 250,
          sparkline: { enabled: true },
        },
        plotOptions: {
          bar: { horizontal: false, columnWidth: "55%", endingShape: "rounded" },
        },
        xaxis: {
          categories: data.months || [], // Assurez-vous que les mois sont disponibles
        },
        yaxis: {
          title: { text: "$ (thousands)" },
        },
        tooltip: {
          y: { formatter: (val) => "$ " + val + " thousands" },
        },
      };

      var chart = new ApexCharts(document.querySelector("#apex2"), options);
      chart.render();

      // Cacher le message de chargement une fois les données chargées
      document.getElementById("loadingMessage").style.display = "none";
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données:", error);
      document.getElementById("loadingMessage").style.display = "none";
    });
}

// Appeler la fonction pour récupérer les données au chargement de la page
document.addEventListener("DOMContentLoaded", fetchDashboardData);
