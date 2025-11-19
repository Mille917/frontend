import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AdminUserSeeder extends BaseSeeder {
  public async run() {
    const passwordHash = await hash.use('scrypt').make('TonMotDePasseSecurise')

    await User.updateOrCreate(
      { email: 'admin@portfolio.com' },
      {
        full_name: 'Raïssa Bomboko',
        email: 'admin@portfolio.com',
        password: passwordHash,
      }
    )
  }
}
