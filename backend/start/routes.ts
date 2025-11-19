/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Ce fichier définit toutes les routes de ton API backend.
| On utilise une organisation claire :
| - /api/public → accès sans auth (portfolio)
| - /api/admin → accès restreint (gestion via login)
|
*/

import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const SkillsController = () => import('#controllers/skills_controller')
const ExperiencesController = () => import('#controllers/experiences_controller')
const ContactsController = () => import('#controllers/contacts_controller')
const DashboardController = () => import('#controllers/dashboard_controller')

// Route de test basique

router.get('/', async () => {
  return { hello: 'world' }
})

// Route pour le dashboard admin
router.get('/api/dashboard', [DashboardController, 'index'])

/* -------------------------------------------------------------------------- */
/* 🟢 SECTION PUBLIQUE (accessible depuis ton site Nuxt)                      */
/* -------------------------------------------------------------------------- */
router
  .group(() => {
    // 📁 Portfolio content
    router.get('projects', [ProjectsController, 'index'])
    router.get('projects/latest', [ProjectsController, 'store'])
    router.get('projects/:id', [ProjectsController, 'show'])

    router.get('skills', [SkillsController, 'index'])
    router.get('skills/:id', [SkillsController, 'show'])
    router.get('skills/latest', [SkillsController, 'store'])

    router.get('experiences', [ExperiencesController, 'index'])
    router.get('experiences/:id', [ExperiencesController, 'show'])
    router.get('experiences/latest', [ExperiencesController, 'store'])

    // 📬 Contact form
    router.post('contact', [ContactsController, 'store'])
  })
  .prefix('/api/public')

/* -------------------------------------------------------------------------- */
/* 🔐 SECTION ADMIN (pour gestion CRUD complète, via back-office)             */
/* -------------------------------------------------------------------------- */

const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.get('me', [AuthController, 'me']).use(async ({ auth }, next) => {
      await auth.authenticate()
      await next()
    })
    router.post('logout', [AuthController, 'logout']).use(async ({ auth }, next) => {
      await auth.authenticate()
      await next()
    })
  })
  .prefix('/api/auth')

router
  .group(() => {
    router.resource('users', UsersController).apiOnly()
    router.resource('projects', ProjectsController).apiOnly()
    router.resource('skills', SkillsController).apiOnly()
    router.resource('experiences', ExperiencesController).apiOnly()
    router.resource('contacts', ContactsController).apiOnly()
  })
  .prefix('/api')
