const _ = require('lodash')
const {
  BASE_URL
} = require('../config')
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
    description: 'Search record using TC API'
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
      if (bundle.inputData.version === 'v3' && bundle.inputData.api === 'members') {
        return [{
          key: 'handle',
          type: 'string',
          label: 'Handle',
          required: true
        }]
      } else if (bundle.inputData.version === 'v5') {
        return [{
          key: 'queryParam',
          type: 'string',
          label: 'Full query',
          required: false
        }]
      } else {
        return [{
          key: 'path',
          type: 'string',
          label: 'Path',
          helpText: 'the path parameter(optional)'
        }]
      }
    }
    ],

    perform: (z, bundle) => {
      const {
        environment,
        version,
        api,
        path,
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
      return z
        .request(options)
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
