const _ = require('lodash')
const { BASE_URL } = require('../config')
const m2mAuth = require('tc-core-library-js').auth.m2m

module.exports = {
  key: 'record',

  noun: 'Record',
  display: {
    label: 'Create Record',
    description: 'Creates a new record'
  },

  operation: {
    inputFields: [
      {
        key: 'environment',
        label: 'Environment',
        helpText: 'the environment configuration',
        required: true,
        choices: ['Development', 'Production']
      },
      {
        key: 'version',
        label: 'Version',
        helpText: 'the api version',
        required: true,
        choices: ['v3', 'v4', 'v5'],
        altersDynamicFields: true
      },
      {
        key: 'api',
        label: 'API',
        helpText: 'the api type',
        required: true,
        choices: ['submissions', 'challenges', 'projects', 'members', 'groups']
      },
      {
        key: 'body',
        label: 'Body',
        required: true
      },
      (z, bundle) => {
        if (bundle.inputData.version !== 'v5') {
          return []
        }
        return [
          {
            key: 'clientId',
            label: 'Client ID',
            required: true,
            type: 'string'
          },
          {
            key: 'clientSecret',
            label: 'Client Secret',
            required: true,
            type: 'string'
          },
          {
            key: 'authAudience',
            label: 'Auth Audience',
            required: true,
            type: 'string'
          },
          {
            key: 'authUrl',
            label: 'Auth Url',
            required: true,
            type: 'string'
          }
        ]
      }
    ],
    perform: (z, bundle) => {
      const { environment, version, api, body } = bundle.inputData
      const url = `${BASE_URL[environment]}/${version}/${api}`
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.parse(body)
      }
      if (version === 'v5') {
        const m2m = m2mAuth({
          AUTH0_URL: bundle.inputData.authUrl,
          AUTH0_AUDIENCE: bundle.inputData.authAudience
        })
        return m2m.getMachineToken(bundle.inputData.clientId, bundle.inputData.clientSecret)
          .then(token => z.request(url, _.assignIn(options, { headers: { Authorization: `Bearer ${token}` } })))
          .then(response => JSON.parse(response.content))
      } else {
        return z.request(url, options).then(response => JSON.parse(response.content))
      }
    }
  }
}
