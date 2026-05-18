import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
export default class AdminUserSeeder extends BaseSeeder {
  public async run() {
    await User.updateOrCreate(
      { email: 'admin@portfolio.com' },
      {
        full_name: 'Raïssa Bomboko',
        email: 'admin@portfolio.com',
        password: 'TonMotDePasseSecurise',
      }
    )
  }
}
