const _ = require('lodash')
const {
  BASE_URL
} = require('../config')
const m2mAuth = require('tc-core-library-js').auth.m2m
const {
  convertRes,
  getFinalPath
} = require('../common/helper')

const SAMPLE_CHALLENGE = require('../common/samples').search.challenge

module.exports = {
  key: 'record',

  noun: 'Record',
  display: {
    label: 'Find Record',
    description: 'Search record using TC API (M2M)'
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
      key: 'property',
      type: 'string',
      label: 'Property',
      helpText: 'the property value (optional)'
    },
    (z, bundle) => {
      const authenticateParams = [{
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
      }]
      if (bundle.inputData.version === 'v3' && bundle.inputData.api === 'members') {
        return [
          ...authenticateParams,
          {
            key: 'handle',
            type: 'string',
            label: 'Handle',
            required: true
          }
        ]
      } else if (bundle.inputData.version === 'v5') {
        return [
          ...authenticateParams,
          {
            key: 'queryParam',
            type: 'string',
            label: 'Full query',
            required: true
          }
        ]
      } else {
        return [
          ...authenticateParams,
          {
            key: 'path',
            type: 'string',
            label: 'Path',
            helpText: 'the path parameter(optional)'
          }
        ]
      }
    }
    ],

    perform: (z, bundle) => {
      const {
        environment,
        version,
        api,
        path,
        authUrl,
        authAudience,
        clientId,
        clientSecret,
        handle,
        queryParam,
        property
      } = bundle.inputData
      const finalPath = getFinalPath(path, handle)
      const url = `${BASE_URL[environment]}/${version}/${api}${finalPath}`
      const options = {
        method: 'GET',
        url,
        params: queryParam ? JSON.parse(queryParam) : null
      }
      const m2m = m2mAuth({
        AUTH0_URL: authUrl.trim(),
        AUTH0_AUDIENCE: authAudience.trim()
      })
      return m2m.getMachineToken(clientId.trim(), clientSecret.trim())
        .then(token => z.request(_.assignIn(options, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })))
        .then(response => {
          let res = response.content ? JSON.parse(response.content) : JSON.parse(response)
          res = convertRes(version, res)
          if (property) {
            res = _.map(res, e => _.pick(e, property))
          }
          return res
        })
    },
    sample: SAMPLE_CHALLENGE
  }
}
