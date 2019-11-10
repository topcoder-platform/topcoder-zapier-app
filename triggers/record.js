const { BASE_URL } = require('../config')
const { convertRes } = require('../common/helper')

module.exports = {
  key: 'record',

  noun: 'Record',
  display: {
    label: 'Get Record',
    description: 'Triggers on a new record.'
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
        choices: ['submissions', 'challenges']
      },
      {
        key: 'path',
        type: 'string',
        label: 'Path',
        helpText: 'the path parameter(optional)'
      }
    ],

    perform: (z, bundle) => {
      const { environment, version, api, path } = bundle.inputData
      const url = `${BASE_URL[environment]}/${version}/${api}${path || ''}`
      return z
        .request(url)
        .then(response => {
          const res = JSON.parse(response.content)
          return convertRes(version, res)
        })
        .catch(e => {
          z.console.log(e.message)
          return []
        })
    }
  }
}
