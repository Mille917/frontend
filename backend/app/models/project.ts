import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare image_url: string | null

  @column()
  declare technologies: string | null

  @column()
  declare github_link: string | null

  @column()
  declare demo_link: string | null

  // 🔥 Nouvelles colonnes :
  @column()
  declare price: number | null

  @column()
  declare duration: string | null

  @column()
  declare images: string[] | null // JSON array (Cloudinary URLs)

  @belongsTo(() => User)
  declare user: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
