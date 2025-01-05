const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');  // Ajoutez cette ligne

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'votre_clé_secrète',  // Remplacez par une clé secrète
    resave: false,
    saveUninitialized: true
}));

// Connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mymanager'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err);
        throw err;
    }
    console.log('Connecté à la base de données MySQL !');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Données reçues :', { username, password });

    // Requête pour récupérer l'utilisateur
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Erreur de requête SQL :', err);
            return res.status(500).json({ message: 'Erreur de la base de données', error: err });
        }

        if (results.length === 0) {
            console.log('Utilisateur introuvable');
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        const storedPassword = results[0].password;
        const userRole = results[0].role;

        // Vérification du mot de passe sans hash
        if (password === storedPassword) {
            console.log(`Connexion réussie pour l'utilisateur ${username}`);
            
            // Sauvegarde de l'utilisateur dans la session
            req.session.user = { username, role: userRole };

            res.status(200).json({ message: 'Connexion réussie', role: userRole });
        } else {
            console.log('Mot de passe incorrect');
            res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
    });
});

// Route pour vérifier si l'utilisateur est connecté
app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ message: 'Utilisateur connecté', user: req.session.user });
    } else {
        res.status(401).json({ message: 'Utilisateur non connecté' });
    }
});

// Route pour la déconnexion
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la destruction de la session:', err); // Affiche l'erreur dans la console
            return res.status(500).json({ message: 'Erreur de déconnexion', error: err });
        }
        console.log('Session détruite avec succès');
        res.status(200).json({ message: 'Déconnexion réussie' });
    });
});



// Route pour ajouter un utilisateur
app.post('/users', (req, res) => {
    const { username, password, role } = req.body;

    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, password, role], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur' });
        }
        res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
    });
});

// Route pour afficher tous les utilisateurs
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
        }
        res.json(results);
    });
});

// Route pour supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Tentative de suppression de l'utilisateur avec l'id: ${id}`);

    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur de suppression:', err);
            return res.status(500).json({ message: 'Erreur de la base de données' });
        }

        if (results.affectedRows === 0) {
            console.log('Aucun utilisateur trouvé avec cet ID');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        console.log('Utilisateur supprimé avec succès');
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    });
});

// Route pour modifier un utilisateur
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    console.log('Données de mise à jour reçues:', { username, password, role, id });

    const query = 'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?';
    db.query(query, [username, password, role, id], (err, results) => {
        if (err) {
            console.error('Erreur de mise à jour:', err);
            return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }

        console.log('Résultats de la mise à jour:', results);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    });
});

// Route pour ajouter un client
app.post("/clients", (req, res) => {
    const { nom, prenom, telephone } = req.body;

    if (!nom || !prenom || !telephone) {
        return res.status(400).json({ message: "Toutes les informations sont nécessaires." });
    }

    const query = "INSERT INTO clients (nom, prenom, telephone) VALUES (?, ?, ?)";
    
    db.query(query, [nom, prenom, telephone], (err, results) => {
        if (err) {
            console.error("Erreur lors de l'ajout du client", err);
            return res.status(500).json({ message: "Erreur lors de l'ajout du client" });
        }
        res.status(201).json({ message: "Client ajouté avec succès" });
    });
});

// Route pour obtenir tous les clients
app.get("/clients", (req, res) => {
    const query = "SELECT * FROM clients";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération des clients" });
        }
        res.json(results);
    });
});

// Route pour supprimer un client
app.delete("/clients/:id_client", (req, res) => {
    const clientId = req.params.id_client;
    const query = "DELETE FROM clients WHERE id_client = ?";
    db.query(query, [clientId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression du client :", err);
            return res.status(500).json({ message: "Erreur lors de la suppression du client" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Client non trouvé" });
        }
        res.status(200).json({ message: "Client supprimé avec succès" });
    });
});

// Route pour modifier un client
app.put("/clients/:id_client", (req, res) => {
    const clientId = req.params.id_client;
    const { nom, prenom, telephone } = req.body;

    if (!nom || !prenom || !telephone) {
        return res.status(400).json({ message: "Toutes les informations sont nécessaires." });
    }

    const query = "UPDATE clients SET nom = ?, prenom = ?, telephone = ? WHERE id_client = ?";
    
    db.query(query, [nom, prenom, telephone, clientId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la mise à jour du client" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Client non trouvé" });
        }
        res.status(200).json({ message: "Client mis à jour avec succès" });
    });
});

// Route pour obtenir un client par son ID
app.get('/clients/:id_client', (req, res) => {
    const { id_client } = req.params;
    const query = 'SELECT * FROM clients WHERE id_client = ?';
    
    db.query(query, [id_client], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération du client' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.json(results[0]);
    });
});


// Route pour obtenir tous les clients
// Route pour obtenir tous les véhicules
app.get('/vehicles', (req, res) => {
    const query = 'SELECT * FROM vehicules'; // Assurez-vous que 'vehicules' est le nom de la table dans votre base de données
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des véhicules :', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération des véhicules' });
        }
        res.json(results); // Retourne tous les véhicules en format JSON
    });
});


// Route pour obtenir tous les véhicules
app.get('/vehicles/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM vehicules WHERE id_vehicule = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du véhicule :', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération du véhicule.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Véhicule non trouvé.' });
        }
        res.status(200).json(results[0]);
    });
});


// Route pour ajouter un véhicule
app.post('/vehicles', (req, res) => {
    const { marque, modele, immatriculation, probleme, id_client, etat } = req.body;

    if (!marque || !modele || !immatriculation || !etat || !id_client) {
        return res.status(400).json({ message: "Tous les champs sont nécessaires." });
    }

    const query = "INSERT INTO vehicules (marque, modele, immatriculation, probleme, id_client, etat) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [marque, modele, immatriculation, probleme, id_client, etat], (err, results) => {
        if (err) {
            console.error("Erreur lors de l'ajout du véhicule :", err);
            return res.status(500).json({ message: "Erreur lors de l'ajout du véhicule." });
        }
        res.status(201).json({ message: "Véhicule ajouté avec succès" });
    });
});

// Route pour modifier un véhicule
app.put('/vehicles/:id', (req, res) => {
    const { id } = req.params;
    const { marque, modele, immatriculation, probleme, etat, id_client } = req.body;

    // Validation des données
    if (!marque || !modele || !immatriculation || !etat || !id_client) {
        return res.status(400).json({ message: "Tous les champs sont nécessaires." });
    }

    // Requête SQL pour mettre à jour le véhicule
    const query = "UPDATE vehicules SET marque = ?, modele = ?, immatriculation = ?, probleme = ?, etat = ?, id_client = ? WHERE id_vehicule = ?";
    db.query(query, [marque, modele, immatriculation, probleme, etat, id_client, id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la modification du véhicule :", err);
            return res.status(500).json({ message: "Erreur lors de la modification du véhicule." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Véhicule non trouvé." });
        }
        res.status(200).json({ message: "Véhicule modifié avec succès" });
    });
});
app.delete('/vehicles/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM vehicules WHERE id_vehicule = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression du véhicule :", err);
            return res.status(500).json({ message: "Erreur lors de la suppression du véhicule." });
        }
        res.status(200).json({ message: "Véhicule supprimé avec succès" });
    });
});


// Route pour supprimer une réparation
app.delete('/repairs/:id', (req, res) => {
    const { id } = req.params;
  
    // Vérification si l'ID est valide
    if (!id) {
      return res.status(400).json({ message: 'ID de réparation manquant' });
    }
  
    // Requête SQL pour supprimer la réparation
    const query = 'DELETE FROM repairs WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Erreur lors de la suppression de la réparation:', err);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Réparation non trouvée' });
      }
  
      // Retourner une réponse de succès
      res.status(200).json({ message: 'Réparation supprimée avec succès' });
    });
  });
  

// Route pour récupérer toutes les réparations
app.get('/repairs', (req, res) => {
    db.query('SELECT * FROM repairs', (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des réparations:', err);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
      }
      res.json(results);
    });
  });
  
  
  // Route pour ajouter une nouvelle réparation
  app.post('/repairs', (req, res) => {
    const { id_vehicule, description, cost, repair_date, status } = req.body;
  
    // Validation des données
    if (!id_vehicule || !description || !cost || !repair_date || !status) {
      return res.status(400).json({ message: 'Toutes les données doivent être fournies' });
    }
  
    // Insérer la réparation dans la base de données
    const query = 'INSERT INTO repairs (id_vehicule, description, cost, repair_date, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [id_vehicule, description, cost, repair_date, status], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion de la réparation:', err);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
      }
  
      // Si l'insertion réussit, envoyer une réponse
      console.log('Réparation ajoutée:', result);
      res.status(201).json({ message: 'Réparation ajoutée avec succès' });
    });
  });


  app.get('/repairs/:id', (req, res) => {
    const repairId = req.params.id;
    const query = 'SELECT * FROM repairs WHERE id = ?';
    db.query(query, [repairId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la réparation:', err);
            res.status(500).send('Erreur interne du serveur');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Réparation non trouvée');
            return;
        }
        res.json(results[0]);
    });
});
// Route pour mettre à jour une réparation
app.put('/repairs/:id', (req, res) => {
    const repairId = req.params.id; // ID de la réparation
    const { status, id_vehicule, repair_date } = req.body; // Champs requis

    // Validation
    if (!status || !id_vehicule || !repair_date) {
        console.log('Champs manquants :', { status, id_vehicule, repair_date });
        return res.status(400).json({ message: 'Champs manquants' });
    }

    // Requête SQL pour mise à jour
    const query = 'UPDATE repairs SET status = ?, id_vehicule = ?, repair_date = ? WHERE id = ?';
    db.query(query, [status, id_vehicule, repair_date, repairId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour :', err);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Réparation non trouvée' });
        }

        res.status(200).json({ message: 'Réparation mise à jour avec succès' });
    });
});

app.get('/stats', (req, res) => {
    // Exemple de requêtes pour récupérer les données
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM users) AS users_count,
            (SELECT COUNT(*) FROM vehicules) AS vehicles_count,
            (SELECT COUNT(*) FROM clients) AS clients_count,
            (SELECT COUNT(*) FROM repairs) AS repairs_count,
            -- Exemple pour les graphiques
            JSON_ARRAY('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun') AS months,
            JSON_ARRAY(30, 40, 35, 50, 49, 60) AS net_profit,
            JSON_ARRAY(80, 100, 90, 120, 110, 130) AS revenue,
            JSON_ARRAY(20, 30, 25, 40, 35, 45) AS free_cash_flow
    `;
    
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result[0]);  // Envoi des résultats sous forme de JSON
    });
});



  
  
// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});