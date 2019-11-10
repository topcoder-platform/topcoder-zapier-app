const _ = require('lodash')

module.exports = {
  convertRes: (version, res) => {
    if (version === 'v5') {
      // v5 api
      return _.isArray(res) ? res : [res]
    } else {
      // v3/v4 api
      if (_.isArray(res.result.content)) {
        return res.result.content
      } else {
        if (!res.result.content.id) {
          res.result.content.id = 'dummy-id'
        }
        return [res.result.content]
      }
    }
  }
}
