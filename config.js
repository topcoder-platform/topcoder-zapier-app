module.exports = {
  AUTH0_URL: process.env.AUTH0_URL || 'https://topcoder-dev.auth0.com/oauth/token',
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://m2m.topcoder-dev.com/',
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME || 90,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || '8QovDh27SrDu1XSs68m21A1NBP8isvOt',
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_ID || '3QVxxu20QnagdH-McWhVz0WfsQzA1F8taDdGDI4XphgpEYZPcMTF4lX3aeOIeCzh',
  BASE_URL: {
    Development: 'https://api.topcoder-dev.com',
    Production: 'https://api.topcoder.com'
  }
}
