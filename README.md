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
