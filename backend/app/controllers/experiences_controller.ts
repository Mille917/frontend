import type { HttpContext } from '@adonisjs/core/http'
import Experience from '#models/experience'

export default class ExperiencesController {
  async index({ response }: HttpContext) {
    const experiences = await Experience.all()
    return response.ok(experiences)
  }

  async show({ params, response }: HttpContext) {
    const exp = await Experience.find(params.id)
    if (!exp) return response.notFound({ message: 'Experience not found' })
    return response.ok(exp)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'title',
      'position',
      'location',
      'company',
      'start_date',
      'end_date',
      'description',
    ])
    // si title existe, on le mappe à position
    if (data.title && !data.position) {
      data.position = data.title
    }
    const exp = await Experience.create(data)
    return response.created(exp)
  }

  async update({ params, request, response }: HttpContext) {
    const exp = await Experience.find(params.id)
    if (!exp) return response.notFound({ message: 'Experience not found' })

    exp.merge(request.all())
    await exp.save()
    return response.ok(exp)
  }

  async destroy({ params, response }: HttpContext) {
    const exp = await Experience.find(params.id)
    if (!exp) return response.notFound({ message: 'Experience not found' })
    await exp.delete()
    return response.ok({ message: 'Experience deleted successfully' })
  }
}
