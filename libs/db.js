'use strict'

let knexfile = require('../knexfile')
let knex = require('knex')(knexfile[process.env.NODE_ENV || 'development'])
let bookshelf = require('bookshelf')(knex)
let bookshelfUuid = require('bookshelf-uuid')
let bookshelfBcrypt = require('bookshelf-bcrypt')

bookshelf.plugin(bookshelfUuid)
bookshelf.plugin(bookshelfBcrypt)
bookshelf.plugin('visibility')

module.exports = bookshelf
