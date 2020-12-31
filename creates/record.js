const _ = require('lodash')
const {
  BASE_URL
} = require('../config')

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
      key: 'body',
      label: 'Body',
      required: true
    },
    (z, bundle) => {
      if (bundle.inputData.method !== 'POST') {
        return [{
          key: 'path',
          type: 'string',
          label: 'Path',
          required: true,
          helpText: 'the id path parameter'
        }]
      }
      return []
    }],
    perform: (z, bundle) => {
      const {
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
      const options = {
        method: bundle.inputData.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.parse(body)
      }
      return z.request(url, options).then(response => JSON.parse(response.content))
    },
    sample: SAMPLE_CHALLENGE_CREATE
  }
}
