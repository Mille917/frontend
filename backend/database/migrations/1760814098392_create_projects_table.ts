import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ProjectsSchema extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description')
      table.string('image_url')
      table.string('technologies')
      table.string('github_link')
      table.string('demo_link')
      table.float('price') // 💰 Prix estimé
      table.string('duration') // ⏱️ Durée de création
      table.json('images') // 🖼️ Galerie d'images supplémentaires

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
