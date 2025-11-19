import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ExperiencesSchema extends BaseSchema {
  protected tableName = 'experiences'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.string('position')
      table.string('company').notNullable()
      table.string('location')
      table.date('start_date')
      table.date('end_date')
      table.text('description')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
