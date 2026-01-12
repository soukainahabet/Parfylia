# Parfumerie Parfylia

Application e-commerce complète pour une parfumerie en ligne, développée avec une architecture full-stack moderne et une base de données multi-modèle.

## Captures d'écran

### Page d'accueil
<img src="screenshots/home.png" alt="Page d'accueil" width="800">

### Catalogue des produits
<img src="screenshots/products.png" alt="Catalogue des produits" width="800">

### Détail d'un produit
<img src="screenshots/product-detail.png" alt="Détail produit" width="800">

### Panier
<img src="screenshots/cart.png" alt="Panier" width="800">

### Tableau de bord Admin
<img src="screenshots/admin-dashboard.png" alt="Admin Dashboard" width="800">

### Gestion des produits (Admin)
<img src="screenshots/admin-products.png" alt="Gestion des produits" width="800">

---

## Description

Parfumerie Parfylia est une plateforme de vente de parfums en ligne offrant une expérience utilisateur élégante et intuitive. L'application permet aux clients de parcourir un catalogue de parfums, de gérer leur panier et de passer des commandes, tandis que les administrateurs disposent d'un tableau de bord complet pour la gestion des produits, des commandes et des utilisateurs.

## Fonctionnalités

### Utilisateur
- Inscription et authentification sécurisée (JWT)
- Navigation et recherche de parfums par catégorie, marque et prix
- Gestion du panier d'achat
- Passage et suivi des commandes
- Gestion du profil et des adresses de livraison
- Consultation de l'historique des commandes
- Système d'avis et de notes sur les produits

### Administrateur
- Tableau de bord avec statistiques
- Gestion complète des produits (CRUD)
- Gestion des commandes et de leur statut
- Gestion des utilisateurs
- Gestion des catégories et des marques

## Technologies Utilisées

### Backend
- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Security** avec JWT
- **Spring Data JPA** (MySQL)
- **Spring Data MongoDB**
- **Spring Data Neo4j**

### Frontend
- **React 19**
- **React Router v7**
- **Axios** pour les requêtes HTTP
- **CSS3** avec design responsive

### Bases de Données
- **MySQL** - Utilisateurs, produits, commandes
- **MongoDB** - Avis, historique des commandes
- **Neo4j** - Graphe des marques, catégories et relations produits

## Prérequis

- Java 17+
- Node.js 18+
- MySQL 8.0+ (port 3306)
- MongoDB 6.0+ (port 27017)
- Neo4j 5.0+ (port 7687)

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/soukainahabet/Parfylia.git
cd Parfylia
```

### 2. Configuration des bases de données

**MySQL**
```sql
CREATE DATABASE parfylia;
```

**MongoDB**
```bash
# La base de données sera créée automatiquement
```

**Neo4j**
- Créer une base de données avec les identifiants : `neo4j` / `Neo4j123`

### 3. Configuration du Backend

Modifier si nécessaire le fichier `Backend/parfilya/parfilya/src/main/resources/application.yaml` :

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/parfylia
    username: root
    password: root
  data:
    mongodb:
      uri: mongodb://localhost:27017/parfylia_db
    neo4j:
      uri: bolt://localhost:7687
      authentication:
        username: neo4j
        password: Neo4j123
```

### 4. Installation des dépendances Frontend

```bash
cd Frontend/parfylia-f
npm install
```

## Lancement de l'Application

### Backend (Port 8081)

```bash
cd Backend/parfilya/parfilya
./mvnw spring-boot:run
```

Windows :
```cmd
cd Backend\parfilya\parfilya
mvnw.cmd spring-boot:run
```

### Frontend (Port 3000)

```bash
cd Frontend/parfylia-f
npm start
```

L'application sera accessible sur : `http://localhost:3000`

## Endpoints API Principaux

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |

### Produits
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Liste des produits |
| GET | `/api/products/{id}` | Détails d'un produit |
| GET | `/api/products/category/{category}` | Produits par catégorie |
| GET | `/api/products/brand/{brand}` | Produits par marque |

### Panier & Commandes (Authentifié)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/cart` | Voir le panier |
| POST | `/api/cart/add` | Ajouter au panier |
| DELETE | `/api/cart/remove/{id}` | Retirer du panier |
| POST | `/api/orders` | Créer une commande |
| GET | `/api/orders` | Historique des commandes |

### Administration (ROLE_ADMIN)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/products` | Liste des produits |
| POST | `/api/admin/products` | Créer un produit |
| PUT | `/api/admin/products/{id}` | Modifier un produit |
| DELETE | `/api/admin/products/{id}` | Supprimer un produit |
| GET | `/api/admin/orders` | Liste des commandes |
| PUT | `/api/admin/orders/{id}/status` | Modifier statut commande |
| GET | `/api/admin/users` | Liste des utilisateurs |

## Compte Administrateur par Défaut

```
Email : superadmin@parfylia.com
Mot de passe : Admin@123
```

## Structure du Projet

```
ParfumerieParfylia/
├── Backend/
│   └── parfilya/parfilya/
│       └── src/main/java/parfumerie/parfilya/
│           ├── config/          # Configuration (CORS, Security, DB)
│           ├── controllers/     # Contrôleurs REST
│           ├── services/        # Logique métier
│           ├── models/          # Entités (MySQL, MongoDB, Neo4j)
│           ├── repositories/    # Accès aux données
│           ├── security/        # JWT et authentification
│           └── dto/             # Objets de transfert
│
└── Frontend/
    └── parfylia-f/src/
        ├── components/          # Composants React
        ├── pages/               # Pages de l'application
        ├── context/             # Contextes (Auth, Cart)
        ├── services/            # Services API
        └── utils/               # Configuration Axios
```

## Licence

Ce projet est développé à des fins éducatives.

---

Développé avec :heart: par l'équipe Parfylia
