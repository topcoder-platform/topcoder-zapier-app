const _ = require('lodash')
const {
  BASE_URL
} = require('../config')
const m2mAuth = require('tc-core-library-js').auth.m2m

const SAMPLE_CHALLENGE_CREATE = require('../common/samples').create.challenge

module.exports = {
  key: 'record',

  noun: 'Record',
  display: {
    label: 'Create Record',
    description: 'Creates a new record'
  },

  operation: {
    inputFields: [{
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
      choices: ['submissions', 'challenges', 'projects', 'members', 'groups', 'users', 'jobs', 'jobCandidates', 'resourceBookings']
    },
    {
      key: 'method',
      label: 'Method',
      helpText: 'the api method',
      required: true,
      altersDynamicFields: true,
      choices: ['POST', 'PUT', 'PATCH']
    },
    {
      key: 'authenticate',
      label: 'Authentication with M2M token',
      helpText: 'if M2M authentication is required (optional. default is \'no\')',
      choices: ['yes', 'no'],
      altersDynamicFields: true
    },
    {
      key: 'body',
      label: 'Body',
      required: true
    },
    (z, bundle) => {
      if (bundle.inputData.authenticate === 'no') {
        if (bundle.inputData.method !== 'POST') {
          return [{
            key: 'path',
            type: 'string',
            label: 'Path',
            required: true,
            helpText: 'the path parameter'
          }]
        }
        return []
      }
      return [{
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
      const {
        authenticate,
        environment,
        version,
        api,
        path,
        body
      } = bundle.inputData
      var url = `${BASE_URL[environment]}/${version}/${api}`
      if (path) {
        url += `/${path}`
      }
      z.console.log(`Body ${body}`)
      const options = {
        method: bundle.inputData.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.parse(body)
      }
      if (authenticate === 'yes') {
        const m2m = m2mAuth({
          AUTH0_URL: bundle.inputData.authUrl,
          AUTH0_AUDIENCE: bundle.inputData.authAudience
        })
        return m2m.getMachineToken(bundle.inputData.clientId, bundle.inputData.clientSecret)
          .then(token => z.request(url, _.assignIn(options, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })))
          .then(response => JSON.parse(response.content))
      } else {
        return z.request(url, options).then(response => JSON.parse(response.content))
      }
    },
    sample: SAMPLE_CHALLENGE_CREATE
  }
}
