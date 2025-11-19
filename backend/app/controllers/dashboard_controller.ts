import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Skill from '#models/skill'
import Experience from '#models/experience'
import Contact from '#models/contact'

export default class DashboardController {
  /**
   * 🧭 Récupère les statistiques globales du portfolio (admin)
   */
  async index({ response }: HttpContext) {
    try {
      // Récupération simultanée des données
      const [projectsCount, skillsCount, experiencesCount, messages] = await Promise.all([
        Project.query().count('* as total'),
        Skill.query().count('* as total'),
        Experience.query().count('* as total'),
        Contact.all(),
      ])

      // Calcul des messages non lus
      const unreadMessages = messages.filter((m) => !m.is_read).length

      // ✅ Retourne les statistiques formatées
      return response.ok({
        projects: Number(projectsCount[0].$extras.total),
        skills: Number(skillsCount[0].$extras.total),
        experiences: Number(experiencesCount[0].$extras.total),
        messages: messages.length,
        unreadMessages,
      })
    } catch (error) {
      console.error('Erreur dashboard:', error)
      return response.internalServerError({
        message: 'Erreur lors du chargement du tableau de bord.',
      })
    }
  }
}
