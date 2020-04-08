const _ = require('lodash')
const { BASE_URL } = require('../config')
const m2mAuth = require('tc-core-library-js').auth.m2m
const { convertRes } = require('../common/helper')

function getFinalPath (path, handle) {
  if (path && path.length) {
    if (path.startsWith('/')) {
      return path
    } else {
      return `/${path}`
    }
  } else if (handle && handle.length) {
    return `/${handle}`
  }
  return ''
}

module.exports = {
  key: 'record',

  noun: 'Record',
  display: {
    label: 'Find Record',
    description: 'Search record using TC API'
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
        choices: ['v3', 'v4', 'v5']
      },
      {
        key: 'api',
        label: 'API',
        helpText: 'the api type',
        required: true,
        choices: ['submissions', 'challenges', 'projects', 'members'],
        altersDynamicFields: true
      },
      {
        key: 'property',
        type: 'string',
        label: 'Property',
        helpText: 'the property value(optional)'
      },
      (z, bundle) => {
        if (bundle.inputData.version === 'v3') {
          return [
            {
              key: 'handle',
              type: 'string',
              label: 'Handle',
              required: true
            }
          ]
        }
        if (bundle.inputData.api === 'projects') {
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
            },
            {
              key: 'path',
              type: 'string',
              label: 'Path',
              helpText: 'the path parameter(optional)'
            }
          ]
        } else {
          return [
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
      const { environment, version, api, path, handle, property } = bundle.inputData
      const finalPath = getFinalPath(path, handle)
      const url = `${BASE_URL[environment]}/${version}/${api}${finalPath}`
      if (version === 'v5' && api === 'projects') {
        const options = {
          method: 'GET'
        }
        const m2m = m2mAuth({
          AUTH0_URL: bundle.inputData.authUrl,
          AUTH0_AUDIENCE: bundle.inputData.authAudience
        })
        return m2m.getMachineToken(bundle.inputData.clientId, bundle.inputData.clientSecret)
          .then(token => z.request(url, _.assignIn(options, { headers: { Authorization: `Bearer ${token}` } })))
          .then(response => {
            let res = response.content ? JSON.parse(response.content) : JSON.parse(response)
            res = convertRes(version, res)
            if (property) {
              res = _.map(res, e => _.pick(e, property))
            }
            return res
          })
      } else {
        return z
          .request(url)
          .then(response => {
            let res = response.content ? JSON.parse(response.content) : JSON.parse(response)
            res = convertRes(version, res)
            if (property) {
              res = _.map(res, e => _.pick(e, property))
            }
            return res
          })
      }
    }
  }
}
