module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/<DATABASE HERE>',
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.REACT_APP_JWT_EXPIRY || '3h'
}
// when deploying to heroku you can set the api key with this command
// heroku config:set API_TOKEN=<YOUR API KEY>
