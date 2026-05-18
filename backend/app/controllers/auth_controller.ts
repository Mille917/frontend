import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const { fullName, email, password } = request.only(['fullName', 'email', 'password'])
    try {
      const user = await User.create({ full_name: fullName, email: email.toLowerCase(), password })
      return response.created({ message: 'User created successfully', user })
    } catch (error: any) {
      // Gère l'erreur de doublon (email unique)
      if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('constraint')) {
        return response.badRequest({ message: 'Cet email est déjà utilisé.' })
      }
      return response.internalServerError({ message: 'Erreur lors de l\'inscription', error: error.message })
    }
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await User.findBy('email', email.toLowerCase())
      if (!user) {
        return response.unauthorized({ message: 'Email non trouvé' })
      }

      const matches = await hash.use('scrypt').verify(user.password, password)
      if (!matches) {
        return response.unauthorized({ message: 'Mot de passe incorrect' })
      }

      const tokenRecord = await User.accessTokens.create(user)
      const { token } = tokenRecord.toJSON()
      return response.ok({ user, token })
    } catch (error: any) {
      return response.internalServerError({ message: 'Erreur lors de la connexion', error: error.message })
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.authenticate()
    await User.accessTokens.delete(auth.user!, auth.user!.currentAccessToken.identifier)
    return response.ok({ message: 'Logged out successfully' })
  }

  async me({ auth, response }: HttpContext) {
    await auth.authenticate()
    return response.ok(auth.user)
  }
}
