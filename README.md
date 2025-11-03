# API d'un bestiaire abyssal

Une petite API Express écrite en TypeScript qui catalogue des créatures légendaires des abysses et permet de les rechercher dans une base MongoDB. L'architecture suit une approche MVC orientée objet :
Schémas et types Mongoose. La logique métier est dans des classes dédiées, le controller orchestre les réponses et les flux requêtes. Le routeur définit les ruotes REST.

# Installaiton

Installe MongoDb pour ton ordi puis installe comme ça:

```bash
npm install
npm run dev
```

Puis allez sur localhost:3000 pour voir la page index.html de test.

Créez ensuite un fichier `.env` à la racine en vous inspirant de `.env.example` (qui ne contient pas de mdps lol):

```env
MONGODB_URI=mongodb://localhost:27017/deep_sea_bestiaire
PORT=3000
```
## Structure du projet

```text
src/
  app.ts               # Initialisation de l'application Express + middlewares
  server.ts            # Point d'entrée, connexion Mongo et démarrage HTTP
  config/database.ts   # Connexion MongoDB (Mongoose)
  models/creature.model.ts    # Schéma + types Mongoose pour une créature abyssale
  services/creature.service.ts# Classe métier (CRUD + recherche)
  controllers/creature.controller.ts # Appels aux services + réponses HTTP
  routes/creature.routes.ts   # Déclaration des routes REST
```

## Endpoints

Les routes sont exposées sur la racine (`/`). Les exemples utilisent `http://localhost:3000`.

### Créer une créature abyssale

`POST /items`

```json
{
  "name": "Léviathan abyssal",
  "species": "Serpenta abyssus",
  "region": "fosse des mariannes",
  "depth": 9000,
  "dangerLevel": "critique",
  "description": "Créature mythique qui se nourrit d'énergie thermique et contrôle les courants froids.",
  "abilities": ["Contrôle des courants", "Hurlement sismique"]
}
```

### Récupérer une créature par identifiant

`GET /items/:id`

### Lister les créatures (avec pagination optionnelle)

`GET /items?page=1&limit=10&region=fosse des mariannes&dangerLevel=critique`

### Rechercher des créatures

`GET /search?keyword=courant&dangerLevel=critique&maxDepth=9500`

- `keyword` recherche dans les champs `name`, `description` et `abilities` via `$regex` insensible à la casse.
- `dangerLevel` permet de filtrer par niveau de danger (`faible`, `modere`, `critique`).
- `maxDepth` applique une profondeur maximale (en mètres).

L'API répond ensuite sur `http://localhost:3000`.

Un endpoint de  health (`GET /health`) est disponible pour vérifier rapidement que l'application tourne.
Bonne correction!
