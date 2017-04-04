'use strict'

exports.up = (knex, Promise) => knex.schema.createTable('users', (table) => {
  table.uuid('id').primary()
  table.string('email').unique().notNullable()
  table.string('password').notNullable()
  table.timestamps()
})

exports.down = (knex, Promise) => knex.schema.dropTable('users')
