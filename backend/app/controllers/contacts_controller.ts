import type { HttpContext } from '@adonisjs/core/http'
import Contact from '#models/contact'

export default class ContactsController {
  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'email', 'message'])
    const contact = await Contact.create(data)
    return response.created({ message: 'Message received!', contact })
  }

  async index({ response }: HttpContext) {
    const contacts = await Contact.all()
    return response.ok(contacts)
  }

  /* 🔍 Voir un message spécifique */
  async show({ params, response }: HttpContext) {
    try {
      const contact = await Contact.find(params.id)
      if (!contact) {
        return response.notFound({ message: 'Message introuvable' })
      }
      return response.ok(contact)
    } catch (error) {
      console.error('Erreur show contact:', error)
      return response.internalServerError({ message: 'Erreur lors du chargement du message' })
    }
  }

  /* ✏️ Marquer comme lu / non lu */
  async update({ params, request, response }: HttpContext) {
    try {
      const contact = await Contact.find(params.id)
      if (!contact) {
        return response.notFound({ message: 'Message introuvable' })
      }

      contact.merge(request.only(['is_read']))
      await contact.save()

      return response.ok({ message: 'Statut mis à jour', contact })
    } catch (error) {
      console.error('Erreur update contact:', error)
      return response.internalServerError({ message: 'Erreur lors de la mise à jour' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const contact = await Contact.find(params.id)
    if (!contact) return response.notFound({ message: 'Message not found' })
    await contact.delete()
    return response.ok({ message: 'Message deleted successfully' })
  }
}
