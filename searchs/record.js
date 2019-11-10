const _ = require('lodash')
const { BASE_URL } = require('../config')
const { convertRes } = require('../common/helper')

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
        choices: ['Development', 'QA', 'Production']
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
        choices: ['submissions', 'challenges', 'members'],
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
        return [
          {
            key: 'path',
            type: 'string',
            label: 'Path',
            helpText: 'the path parameter(optional)'
          }
        ]
      }
    ], 

    perform: (z, bundle) => {
      const { environment, version, api, path, handle, property } = bundle.inputData
      const url = `${BASE_URL[environment]}/${version}/${api}${path || ('/' + handle) || ''}`
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
