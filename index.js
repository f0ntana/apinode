'use strict'

let Hapi = require('hapi')
let User = require('./models/user')
let Joi = require('joi')
let jwt = require('jsonwebtoken')
let Boom = require('boom')


let server = new Hapi.Server({
  debug: {
    request: ['error']
  }
})
server.connection({ host: 'localhost', port: 3000 })

const JWT_KEY = 'jwt_secret'

server.register(require('hapi-auth-jwt2'), (err) => {
  if(err){
    throw err
  }

  function validate(jwt, request, callback){
    User.forge({ id: jwt.id })
    .fetch()
    .then((user) => {
      if (user) {
        callback(null, true, user.toJSON())
      } else {
        callback(null, false)
      }
    })
    .catch((err) => cb(err))
  }

  server.auth.strategy('jwt', 'jwt', {
    key: JWT_KEY,
    validateFunc: validate
  })

  server.route({
    method: 'GET',
    path: '/v1/sessions',
    handler: (request, reply) => {
      reply(request.auth.credentials)
    },
    config: {
      auth: 'jwt'
    }
  })
})



server.route({
  method: 'POST',
  path:'/v1/users', 
  handler: (request, reply) => {
    User.forge(request.payload)
    .save()
    .then((user) => reply(user), (err) => reply(err))
  },
  config: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      })
    }
  }
})

server.route({
  method: 'POST',
  path: '/v1/login',
  handler: (request, reply) => {
    let user
    User.forge({ email: request.payload.email })
    .fetch({ required: true })
    .then((result) => {
      user = result
      return result.compare(request.payload.password)
    })
    .then((isValid) => {
      if(isValid){
        reply({
          token: jwt.sign({id: user.id}, JWT_KEY)
        })
      } else {
        reply(Boom.unauthorized())
      }
    })
  },
  config: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      })
    }
  }
})

server.start((err) => {
  if (err) 
    throw err
  console.log('Server running at:', server.info.uri)
})
