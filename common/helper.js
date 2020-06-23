const _ = require('lodash')
const moment = require('moment-timezone')

module.exports = {
  getFinalPath: (path, handle) => {
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
  },

  convertRes: (version, res) => {
    if (version === 'v5') {
      // v5 api
      const results = _.isArray(res) ? res : [res]
      _.each(results, item => {
        item.startDateFormatted = moment(item.startDate).tz('America/New_York').format()
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
