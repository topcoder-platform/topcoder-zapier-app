const searchRecord = require('./searchs/record')
const recordTrigger = require('./triggers/record')
const createRecord = require('./creates/record')

const includeBearerToken = (request, z, bundle) => {
  // request.headers.Authorization may be set if M2M token is being used
  // in which case signed in users token shouldn't be used
  if (bundle.authData.access_token && request.headers.Authorization == null) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`
  }
  return request
}

const handleHTTPError = (response, z) => {
  if (response.status >= 400) {
    throw new Error(`Unexpected status code ${response.status}`)
  }
  return response
}

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  authentication: require('./authentication'),
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    includeBearerToken
  ],

  afterResponse: [
    handleHTTPError
  ],

  resources: {},

  triggers: {
    [recordTrigger.key]: recordTrigger
  },

  searches: {
    [searchRecord.key]: searchRecord
  },

  creates: {
    [createRecord.key]: createRecord
  }
}

// Finally, export the app
module.exports = App
