1er etape 
j ai essaye de travaillé sur le login d utiliser deux acteurs 
admin et user j ai utilise JSON pour communiquer avec une base de données MySQL
la table => 
<CREATE DATABASE mymanager;
USE mymanager;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  role ENUM('admin', 'user') NOT NULL
);

INSERT INTO users (username, password, role) VALUES ('ali', 'ali', 'admin');
INSERT INTO users (username, password, role) VALUES ('user', 'user', 'user');
>

2eme etape 
 Backend en Node.js pour gérer les requêtes JSON et MySQL
l installation de  Node.js et des bibliothèques nécessaires :
<npm install express mysql body-parser cors>

3eme etape
Pour stocker les mots de passe de manière sécurisée, j ai  est essentiel de les hacher (et non de les enregistrer en clair). Nous allons utiliser bcrypt pour cela.

<npm install bcrypt>

CREATE TABLE repairs (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Identifiant unique pour chaque réparation
    id_vehicule INT NOT NULL,           -- Référence au véhicule concerné
    description TEXT NOT NULL,         -- Description de la réparation
    cost DECIMAL(10, 2) NOT NULL,      -- Coût de la réparation
    repair_date DATE NOT NULL,         -- Date de la réparation
    status ENUM('en cours', 'terminé', 'annulé') DEFAULT 'en cours', -- Statut de la réparation
    FOREIGN KEY (id_vehicule) REFERENCES vehicules(id_vehicule) -- Liaison avec la table vehicles
) ;

Mémoire mise à jour
Pour un mini-projet de gestion de garage avec les rôles d'admin et de user, voici une structure et des propositions pour étendre les fonctionnalités :

1. Fonctionnalités proposées
Admin
Gestion des utilisateurs :

Ajouter, modifier, supprimer des utilisateurs.
Gestion des rôles (admin ou user).
Gestion des clients :

Ajouter, modifier, supprimer les informations des clients.
Rechercher un client par nom ou ID.
Gestion des véhicules :

Ajouter, modifier, supprimer des véhicules associés à un client.
Enregistrer les détails comme la marque, le modèle, l'année, l'état (en réparation, prêt, etc.).
Gestion des réparations :

Ajouter des interventions (réparation, maintenance, diagnostic).
Associer des coûts et des pièces utilisées.
Générer des factures pour les clients.
User
Consultation des informations :

Accéder à la liste des clients et véhicules.
Voir les détails des réparations en cours.

