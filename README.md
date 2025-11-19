📘 README 
⸻

Portfolio – Full-Stack Developer Portfolio

This repository contains my personal portfolio, built with a full-stack architecture:
	•	Frontend: Nuxt 3 + Vue 3 + TailwindCSS
	•	Backend: AdonisJS 6 (API REST)
	•	Database: SQL (via Docker)
	•	Containerization: Docker & Docker Compose

The portfolio includes my projects, experiences, skills, and an admin panel to manage the data.

⸻

📂 Structure

/portfolio
│── backend/      # API AdonisJS (projets, parcours, compétences…)
│── frontend/     # Application Nuxt 3 (Portfolio)
│── docker-compose.yml
│── README.md


⸻

✨ Fonctionnalités

🖥️ Frontend (Nuxt 3)
	•	Page d’accueil moderne (Hero section)
	•	Section Projets
	•	Section Parcours / Expériences
	•	Section Compétences
	•	Section Contact
	•	Mode sombre
	•	Dashboard admin (optionnel)
	•	Appels API via Axios

🔧 Backend (AdonisJS 6)
	•	API REST pour :
	•	Projets
	•	Expériences professionnelles
	•	Galerie
	•	Contact
	•	Upload d’images (Cloudinary ou local)
	•	Authentification (tokens)
	•	Validation des données
	•	ORM Lucid

🐳 Docker
	•	Backend containerisé
	•	Frontend containerisé
	•	Base SQL containerisée (selon besoin)

⸻

🚀 Exécution locale

Frontend

cd frontend
npm install
npm run dev

Accessible sur :
👉 http://localhost:3000

⸻

Backend

cd backend
npm install
cp .env.example .env
npm run dev

Accessible sur :
👉 http://localhost:3333

⸻

🐳 Exécution avec Docker Compose

Depuis la racine du projet :

docker-compose up --build

	•	Frontend → http://localhost:3000
	•	Backend → http://localhost:3333
	•	Base de données (si incluse) → port défini dans docker-compose

⸻

🔧 Variables d’environnement (Backend)

PORT=3333
HOST=0.0.0.0
APP_KEY=your_app_key_here
DB_CONNECTION=pg
PG_HOST=db
PG_USER=postgres
PG_PASSWORD=yourpassword
PG_DB_NAME=portfolio

Frontend (frontend/.env) :

API_URL=http://localhost:3333


⸻

🌍 Déploiement

Plusieurs options possibles :

Frontend (Nuxt)
	•	Netlify
	•	Vercel
	•	Cloudflare Pages
	•	Docker (Fly.io, Render…)

Backend (AdonisJS)
	•	Render (Docker)
	•	Fly.io (Docker) → recommandé
	•	Coolify (self-hosted)
	•	VPS via Docker

⸻

🤝 Contribution

Pull requests are welcome.
Feel free to suggest improvements!

⸻

