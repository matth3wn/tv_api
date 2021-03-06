require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const addRouter = require('./shows/show-router');
const showIdRouter = require('./shows/showid-router')
const proxy = require('http-proxy-middleware')
const app = express()

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
  })
);
app.use(cors())
app.use(helmet())


app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/shows', addRouter);
app.use('/api/myshows', showIdRouter);
app.use('/', proxy({ target: 'https://api.thetvdb.com', changeOrigin: true, logLevel: 'debug' }))

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    console.error(error)
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
