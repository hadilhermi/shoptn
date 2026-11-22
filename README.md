# 🛒 ShopTN

Boutique en ligne full-stack avec authentification, gestion des rôles, commandes et panneau d'administration.

🔗 **Démo :** https://shoptn.vercel.app

## ✨ Fonctionnalités

**Client**
- Catalogue avec recherche et filtres par catégorie
- Panier persistant
- Inscription / connexion sécurisée (JWT)
- Passage de commande et historique des commandes

**Administrateur**
- CRUD des produits
- Gestion des commandes (changement de statut)
- Accès protégé par rôle

**Sécurité**
- Mots de passe hachés (bcrypt)
- Authentification JWT et middleware de rôles
- Prix recalculés côté serveur (le client ne peut pas modifier un total)
- Validation des données et variables d'environnement

## 🧱 Architecture

```
React (Vercel)  →  API REST Express (Render)  →  MongoDB Atlas
```

## 🛠️ Stack

| Couche | Technologies |
|---|---|
| Frontend | React, React Router, Context API, Vite |
| Backend | Node.js, Express, Mongoose |
| Base de données | MongoDB Atlas |
| Authentification | JWT, bcryptjs |
| Déploiement | Vercel, Render, GitHub |

## 🚀 Lancer en local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

Variables d'environnement du backend (`backend/.env`) :

| Variable | Description |
|---|---|
| `PORT` | Port du serveur |
| `MONGO_URI` | Chaîne de connexion MongoDB |
| `JWT_SECRET` | Clé secrète pour signer les tokens |

Variable du frontend : `VITE_API_URL` (URL de l'API).

## 🔌 API

| Méthode | Route | Accès |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Connecté |
| GET | `/api/products` | Public |
| POST / PUT / DELETE | `/api/products` | Admin |
| POST | `/api/orders` | Connecté |
| GET | `/api/orders/mine` | Connecté |
| GET | `/api/orders` | Admin |
| PATCH | `/api/orders/:id/status` | Admin |

## 👩‍💻 Auteure

Hadil Hermi, étudiante en génie logiciel.
