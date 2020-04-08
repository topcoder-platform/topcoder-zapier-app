const _ = require('lodash')
const moment = require('moment-timezone')

module.exports = {
  convertRes: (version, res) => {
    if (version === 'v5') {
      // v5 api
      const results = _.isArray(res) ? res : [res]
      _.each(results, item => {
        item.startDateFormatted = moment(item.startDate).tz('America/New_York').format('MMMM DD YYYY HH:mm:ss')
        item.tagsFormatted = (item.tags && item.tags.length) ? _.join(item.tags, ',') : ''
      })
      return results
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
