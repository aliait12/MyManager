const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
            console.error('Erreur de requête SQL :', err);  // Affiche l'erreur complète
            return res.status(500).json({ message: 'Erreur de la base de données', error: err });
        }

        if (results.length === 0) {
            console.log('Utilisateur introuvable');
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        const storedPassword = results[0].password;
        const userRole = results[0].role;

        console.log('Mot de passe stocké dans la base :', storedPassword);

        // Vérification du mot de passe sans hash
        if (password === storedPassword) {
            console.log(`Connexion réussie pour l'utilisateur ${username}`);
            res.status(200).json({ message: 'Connexion réussie', role: userRole });
        } else {
            console.log('Mot de passe incorrect');
            res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
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
    console.log(`Tentative de suppression de l'utilisateur avec l'ID: ${id}`);

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

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
