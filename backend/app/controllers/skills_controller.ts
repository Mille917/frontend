import type { HttpContext } from '@adonisjs/core/http'
import Skill from '#models/skill'

export default class SkillsController {
  async index({ response }: HttpContext) {
    const skills = await Skill.all()
    return response.ok(skills)
  }

  async show({ params, response }: HttpContext) {
    const skill = await Skill.find(params.id)
    if (!skill) return response.notFound({ message: 'Skill not found' })
    return response.ok(skill)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'category', 'level'])
    const skill = await Skill.create(data)
    return response.created(skill)
  }

  async update({ params, request, response }: HttpContext) {
    const skill = await Skill.find(params.id)
    if (!skill) return response.notFound({ message: 'Skill not found' })

    skill.merge(request.all())
    await skill.save()
    return response.ok(skill)
  }

  async destroy({ params, response }: HttpContext) {
    const skill = await Skill.find(params.id)
    if (!skill) return response.notFound({ message: 'Skill not found' })
    await skill.delete()
    return response.ok({ message: 'Skill deleted successfully' })
  }
}
