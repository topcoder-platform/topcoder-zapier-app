const _ = require('lodash')
const {
  BASE_URL
} = require('../config')
const {
  convertRes,
  getFinalPath
} = require('../common/helper')

const SAMPLE_CHALLENGE = require('../common/samples').trigger.challenge

module.exports = {
  key: 'record',

  noun: 'Record',
  display: {
    label: 'Get Record',
    description: 'Triggers when a new record is available.'
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
      choices: ['submissions', 'challenges', 'projects', 'members', 'groups']
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
        property
      } = bundle.inputData
      const finalPath = getFinalPath(path, handle)
      const url = `${BASE_URL[environment]}/${version}/${api}${finalPath}`
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
    },

    outputFields: [(z, bundle) => {
      switch (bundle.inputData.api) {
        case 'submissions':
          return [{
            key: 'updatedBy',
            label: 'Updated By'
          },
          {
            key: 'created',
            label: 'Created'
          },
          {
            key: 'legacySubmissionId',
            label: 'Legacy Submission Id'
          },
          {
            key: 'isFileSubmission',
            label: 'Is File Submission'
          },
          {
            key: 'type',
            label: 'Type'
          },
          {
            key: 'url',
            label: 'Url'
          },
          {
            key: 'challengeId',
            label: 'Challenge Id'
          },
          {
            key: 'createdBy',
            label: 'Created By'
          },
          {
            key: 'review',
            label: 'Review'
          },
          {
            key: 'id',
            label: 'Id'
          },
          {
            key: 'submissionPhaseId',
            label: 'Submission Phase Id'
          },
          {
            key: 'updated',
            label: 'Updated'
          },
          {
            key: 'fileType',
            label: 'File Type'
          },
          {
            key: 'memberId',
            label: 'Member Id'
          }
          ]
        case 'challenges':
          return [{
            key: 'id',
            label: 'Id'
          },
          {
            key: 'legacyId',
            label: 'Legacy Id'
          },
          {
            key: 'legacy',
            label: 'Legacy'
          },
          {
            key: 'name',
            label: 'Name'
          },
          {
            key: 'description',
            label: 'Description'
          },
          {
            key: 'projectId',
            label: 'Project Id'
          },
          {
            key: 'status',
            label: 'Status'
          },
          {
            key: 'created',
            label: 'Created'
          },
          {
            key: 'createdBy',
            label: 'Created By'
          },
          {
            key: 'updated',
            label: 'Updated'
          },
          {
            key: 'updateBy',
            label: 'Update By'
          },
          {
            key: 'timelineTemplateId',
            label: 'Timeline Template Id'
          },
          {
            key: 'phases',
            label: 'Phases'
          },
          {
            key: 'terms',
            label: 'Terms'
          },
          {
            key: 'startDate',
            label: 'Start Date'
          },
          {
            key: 'endDate',
            label: 'End Date'
          },
          {
            key: 'prizeSets',
            label: 'Prize Sets'
          },
          {
            key: 'tags',
            label: 'Tags'
          },
          {
            key: 'groups',
            label: 'Groups'
          },
          {
            key: 'winners',
            label: 'Winners'
          },
          {
            key: 'metadata',
            label: 'Metadata'
          },
          {
            key: 'type',
            label: 'Type'
          }
          ]
        case 'projects':
          return [{
            key: 'attachments',
            label: 'Attachments'
          },
          {
            key: 'actualPrice',
            label: 'Actual Price'
          },
          {
            key: 'description',
            label: 'Description'
          },
          {
            key: 'billingAccountId',
            label: 'Billing Account Id'
          },
          {
            key: 'lastActivityAt',
            label: 'Last Activity At'
          },
          {
            key: 'challengeEligibility',
            label: 'Challenge Eligibility'
          },
          {
            key: 'type',
            label: 'Type'
          },
          {
            key: 'templateId',
            label: 'Template Id'
          },
          {
            key: 'deletedBy',
            label: 'Deleted By'
          },
          {
            key: 'bookmarks',
            label: 'Bookmarks'
          },
          {
            key: 'createdAt',
            label: 'Created At'
          },
          {
            key: 'lastActivityUserId',
            label: 'Last Activity User Id'
          },
          {
            key: 'terms',
            label: 'Terms'
          },
          {
            key: 'estimatedPrice',
            label: 'Estimated Price'
          },
          {
            key: 'members',
            label: 'Members'
          },
          {
            key: 'details',
            label: 'Details'
          },
          {
            key: 'id',
            label: 'Id'
          },
          {
            key: 'directProjectId',
            label: 'Direct Project Id'
          },
          {
            key: 'cancelReason',
            label: 'Cancel Reason'
          },
          {
            key: 'phases',
            label: 'Phases'
          },
          {
            key: 'updatedAt',
            label: 'Updated At'
          },
          {
            key: 'updatedBy',
            label: 'Updated By'
          },
          {
            key: 'version',
            label: 'Version'
          },
          {
            key: 'external',
            label: 'External'
          },
          {
            key: 'createdBy',
            label: 'Created By'
          },
          {
            key: 'name',
            label: 'Name'
          },
          {
            key: 'status',
            label: 'Status'
          }
          ]
        case 'members':
          return [{
            key: 'id',
            label: 'Id'
          },
          {
            key: 'maxRating',
            label: 'Max Rating'
          },
          {
            key: 'userId',
            label: 'User Id'
          },
          {
            key: 'firstName',
            label: 'First Name'
          },
          {
            key: 'lastName',
            label: 'Last Name'
          },
          {
            key: 'description',
            label: 'Description'
          },
          {
            key: 'otherLangName',
            label: 'Other Lang Name'
          },
          {
            key: 'handle',
            label: 'Handle'
          },
          {
            key: 'handleLower',
            label: 'Handle Lower'
          },
          {
            key: 'status',
            label: 'Status'
          },
          {
            key: 'email',
            label: 'Email'
          },
          {
            key: 'emailVerifyTokenDate',
            label: 'Email Verify Token Date'
          },
          {
            key: 'newEmailVerifyTokenDate',
            label: 'New Email Verify Token Date'
          },
          {
            key: 'addresses',
            label: 'Addresses'
          },
          {
            key: 'homeCountryCode',
            label: 'Home Country Code'
          },
          {
            key: 'competitionCountryCode',
            label: 'Competition Country Code'
          },
          {
            key: 'photoURL',
            label: 'Photo U R L'
          },
          {
            key: 'tracks',
            label: 'Tracks'
          },
          {
            key: 'createdAt',
            label: 'Created At'
          },
          {
            key: 'createdBy',
            label: 'Created By'
          },
          {
            key: 'updatedAt',
            label: 'Updated At'
          },
          {
            key: 'updatedBy',
            label: 'Updated By'
          }
          ]
        case 'groups':
          return [{
            key: 'ssoId',
            label: 'Sso Id'
          },
          {
            key: 'updatedBy',
            label: 'Updated By'
          },
          {
            key: 'description',
            label: 'Description'
          },
          {
            key: 'privateGroup',
            label: 'Private Group'
          },
          {
            key: 'oldId',
            label: 'Old Id'
          },
          {
            key: 'createdAt',
            label: 'Created At'
          },
          {
            key: 'selfRegister',
            label: 'Self Register'
          },
          {
            key: 'createdBy',
            label: 'Created By'
          },
          {
            key: 'domain',
            label: 'Domain'
          },
          {
            key: 'name',
            label: 'Name'
          },
          {
            key: 'id',
            label: 'Id'
          },
          {
            key: 'status',
            label: 'Status'
          },
          {
            key: 'updatedAt',
            label: 'Updated At'
          }
          ]
      }
    }],

    sample: SAMPLE_CHALLENGE
  }
}
