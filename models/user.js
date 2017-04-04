'use strict'

let db = require('../libs/db')

module.exports = db.Model.extend({ 
  tableName: 'users',
  uuid: true,
  hasTimestamps: true,
  bcrypt: { field: 'password'},
  hidden: ['password']
});