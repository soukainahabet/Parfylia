# Guide de Test Frontend - Authentification

## 🚀 Démarrage Rapide

```bash
cd Frontend/parfylia-f
npm install
npm start
```

Ouvre automatiquement : http://localhost:3000

---

## 🧪 Tests à Effectuer

### 1. Test d'Inscription

**URL** : http://localhost:3000/register

**Actions :**
1. Remplir le formulaire :
   - Nom : "John Doe"
   - Email : "john@test.com"
   - Mot de passe : "password123"
2. Cliquer sur "S'inscrire"

**Résultat attendu :**
- ✅ Redirection vers `/` (page d'accueil)
- ✅ Token sauvegardé dans localStorage
- ✅ Console : Pas d'erreur

**Vérifier dans la Console (F12) :**
```javascript
localStorage.getItem('token')
// Devrait retourner un token JWT
```

---

### 2. Test de Connexion

**URL** : http://localhost:3000/login

**Actions :**
1. Utiliser les identifiants créés :
   - Email : "john@test.com"
   - Mot de passe : "password123"
2. Cliquer sur "Se connecter"

**Résultat attendu :**
- ✅ Redirection vers `/`
- ✅ Token dans localStorage
- ✅ Utilisateur connecté

---

### 3. Test de Protection des Routes

**Test A : Accès sans connexion**
1. Supprimer le token : `localStorage.removeItem('token')`
2. Rafraîchir la page
3. Aller sur http://localhost:3000

**Résultat attendu :**
- ✅ Redirection automatique vers `/login`

**Test B : Accès en tant qu'USER**
1. Se connecter avec un compte USER
2. Aller sur http://localhost:3000/admin/users

**Résultat attendu :**
- ✅ Redirection vers `/` (pas admin)

**Test C : Accès en tant qu'ADMIN**
1. Se connecter avec un compte ADMIN
2. Aller sur http://localhost:3000/admin/users

**Résultat attendu :**
- ✅ Page admin affichée

---

### 4. Test du Token JWT dans les Requêtes

**Ouvrir la Console (F12) → Network**

1. Se connecter
2. Faire une requête vers une API protégée (ex: `/api/admin/users`)

**Vérifier dans l'onglet Network :**
- ✅ Headers → Authorization : `Bearer <token>`
- ✅ Token ajouté automatiquement

---

### 5. Test de Gestion d'Erreurs

**Test A : Mauvais mot de passe**
1. Aller sur `/login`
2. Email correct + Mot de passe incorrect
3. Cliquer sur "Se connecter"

**Résultat attendu :**
- ✅ Message d'erreur affiché : "Identifiants incorrects"

**Test B : Email déjà utilisé**
1. Aller sur `/register`
2. Utiliser un email déjà existant
3. Cliquer sur "S'inscrire"

**Résultat attendu :**
- ✅ Message d'erreur affiché : "Email already exists"

---

### 6. Test de Déconnexion

1. Se connecter
2. Appeler la fonction logout (via console ou bouton si disponible)

**Dans la Console :**
```javascript
// Si vous avez accès au contexte
const { logout } = useAuth();
logout();
```

**Résultat attendu :**
- ✅ Token supprimé de localStorage
- ✅ Redirection vers `/login`
- ✅ `user` devient `null`

---

## 🔍 Vérifications dans la Console

### Vérifier le Token
```javascript
// Dans la console du navigateur
const token = localStorage.getItem('token');
console.log('Token:', token);

// Décoder le token
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log('Decoded:', decoded);
// Devrait afficher : { sub, role, permissions, iat, exp }
```

### Vérifier le Contexte Auth
```javascript
// Si vous avez accès au contexte dans un composant
const { user, isAdmin, hasPermission } = useAuth();
console.log('User:', user);
console.log('Is Admin:', isAdmin);
console.log('Has READ:', hasPermission('READ'));
```

---

## 🐛 Dépannage Frontend

### Erreur : "useAuth must be used inside AuthProvider"
- Vérifier que `<AuthProvider>` entoure bien l'app dans `App.js`

### Erreur : "Network Error" ou "CORS"
- Vérifier que le backend est démarré sur port 8081
- Vérifier la configuration CORS dans `CorsConfig.java`

### Token non sauvegardé
- Vérifier la console pour les erreurs
- Vérifier que `login()` est bien appelé avec le token

### Redirection ne fonctionne pas
- Vérifier que `react-router-dom` est bien installé
- Vérifier les routes dans `App.js`

---

## ✅ Checklist Frontend

- [ ] Page register accessible
- [ ] Page login accessible
- [ ] Formulaire d'inscription fonctionne
- [ ] Formulaire de connexion fonctionne
- [ ] Token sauvegardé dans localStorage
- [ ] Redirection après login/register
- [ ] Routes protégées fonctionnent
- [ ] Gestion d'erreurs affichée
- [ ] Token ajouté automatiquement aux requêtes
- [ ] Déconnexion fonctionne

---

Bon test ! 🎉











