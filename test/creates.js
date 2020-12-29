/* global describe, it */

const should = require('should')

const zapier = require('zapier-platform-core')
const nock = require('nock')

const App = require('../index')
const appTester = zapier.createAppTester(App)

zapier.tools.env.inject()

const { AUDIENCE, AUTH_BASE_URL } = process.env

const ACCESS_TOKEN_URL = AUTH_BASE_URL + '/oauth/token'

const {
  BASE_URL
} = require('../config')

const MOCK_M2M_INPUT = {
  authUrl: ACCESS_TOKEN_URL,
  authAudience: AUDIENCE,
  clientId: 'a-client-id',
  clientSecret: 'a-client-secret'
}

function interceptM2MAndReturnMockCreds () {
  nock(`${ACCESS_TOKEN_URL.replace('/token', '')}`)
    .post('/token', body => body.grant_type === 'client_credentials')
    .reply(200, {
      // random JWT generated on https://jwt.io/ [has an insaenly large exp to prevent tc-core-lib to report token as expired]
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjY1ODg1NTQyODd9.XrZmVxYMbgnXTu7EMHPEUenExWxCJ6pjNSpnP4Zafx4',
      scope: 'read:project',
      expires_in: 86400,
      token_type: 'Bearer'
    })
}

describe('Creates', () => {
  describe('dynamic input field', () => {
    it('should not show M2M input fields if Authenticate input is set to No', done => {
      const bundle = {
        inputData: {
          authenticate: 'no'
        }
      }

      appTester(App.creates.record.operation.inputFields, bundle)
        .then(fields => {
          fields.should.not.containDeep([{
            key: 'clientId'
          }, {
            key: 'clientSecret'
          }])
          done()
        })
    })

    it('should show M2M input fields if authenticate input is set to yes', done => {
      const bundle = {
        inputData: {
          authenticate: 'yes'
        }
      }

      appTester(App.creates.record.operation.inputFields, bundle)
        .then(fields => {
          fields.should.containDeep([{
            key: 'clientId'
          }, {
            key: 'clientSecret'
          }])
          done()
        })
    })
  })

  describe('challenge create', () => {
    it('should create challenge with M2M token', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          authenticate: 'yes',
          api: 'challenges',
          body: JSON.stringify({
            name: 'Topcoder Zapier',
            projectId: 16510,
            status: 'Draft'
          }),
          ...MOCK_M2M_INPUT
        }
      }

      interceptM2MAndReturnMockCreds()

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .post(`/${bundle.inputData.api}`, JSON.parse(bundle.inputData.body))
        .reply(201, {
          id: 'f1ddfc6d-9d26-4c21-9f50-437c36838e10',
          created: '2020-05-03T03:32:33.135Z',
          createdBy: 'TonyJ',
          updated: '2020-05-03T03:32:33.135Z',
          updatedBy: 'TonyJ',
          name: 'Topcoder Zapier',
          projectId: 16510,
          status: 'Draft',
          terms: [],
          groups: [],
          numOfSubmissions: 0,
          numOfRegistrants: 0
        })

      appTester(App.creates.record.operation.perform, bundle)
        .then(group => {
          group.id.should.eql('f1ddfc6d-9d26-4c21-9f50-437c36838e10')
          done()
        })
        .catch(done)
    })

    it('should not create challenge if projectId is missing', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          api: 'challenges',
          body: JSON.stringify({
            name: 'Topcoder Zapier',
            status: 'Draft'
          }),
          ...MOCK_M2M_INPUT
        }
      }

      interceptM2MAndReturnMockCreds()

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .post(`/${bundle.inputData.api}`, JSON.parse(bundle.inputData.body))
        .replyWithError(400, {
          message: '"projectId" is required'
        })

      appTester(App.creates.record.operation.perform, bundle)
        .then(group => {
          should.not.exist(group)
          done()
        })
        .catch(error => {
          should.exist(error)
          done()
        })
    })
  })

  describe('group create', () => {
    it('should create group', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          api: 'groups',
          authenticate: 'no',
          body: JSON.stringify({
            privateGroup: true,
            name: 'Zapier Test',
            selfRegister: true
          })
        }
      }

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .post(`/${bundle.inputData.api}`, JSON.parse(bundle.inputData.body))
        .reply(201, {
          name: JSON.parse(bundle.inputData.body).name,
          created: '2020-05-03T03:32:33.135Z'
        })

      appTester(App.creates.record.operation.perform, bundle)
        .then(group => {
          group.name.should.eql(JSON.parse(bundle.inputData.body).name)

          done()
        })
        .catch(done)
    })
  })
})
