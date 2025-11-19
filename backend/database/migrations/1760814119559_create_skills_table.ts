import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SkillsSchema extends BaseSchema {
  protected tableName = 'skills'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('category').notNullable() // exemple: 'language', 'framework', 'tool'
      table.integer('level').unsigned().defaultTo(0) // niveau 0–100
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
