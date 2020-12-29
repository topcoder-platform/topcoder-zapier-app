/* global describe, it, before */

const should = require('should')

const zapier = require('zapier-platform-core')
const nock = require('nock')

const App = require('../index')
const appTester = zapier.createAppTester(App)

zapier.tools.env.inject()

const { AUDIENCE, AUTH_BASE_URL, CLIENT_ID, CLIENT_SECRET } = process.env

const AUTH_URL = AUTH_BASE_URL + '/authorize'
const ACCESS_TOKEN_URL = AUTH_BASE_URL + '/oauth/token'
const SCOPE = 'offline_access openid profile refresh_token'

describe('Authentication', () => {
  before(done => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error(
        'For the tests to run, you need to do `export CLIENT_ID=1234 CLIENT_SECRET=asdf`'
      )
    }

    done()
  })

  it('generates an authorize URL', done => {
    const bundle = {
      inputData: {
        state: '4444',
        redirect_uri: 'https://zapier.com/'
      }
    }

    appTester(App.authentication.oauth2Config.authorizeUrl, bundle).then(authorizeUrl => {
      const actual = new URL(authorizeUrl)
      const expected = new URL(`${AUTH_URL}?scope=${encodeURI(SCOPE)}&client_id=${CLIENT_ID}\
                &state=${bundle.inputData.state}&redirect_uri=${encodeURI(bundle.inputData.redirect_uri)}&response_type=code&audience=\
                ${encodeURI(AUDIENCE)}`)

      actual.origin.should.eql(expected.origin)
      actual.pathname.should.eql(expected.pathname)
      actual.searchParams.should.eql(expected.searchParams)

      done()
    })
  })

  it('can fetch an access token', done => {
    const bundle = {
      inputData: {
        code: 'one_time_code'
      }
    }

    nock(`${ACCESS_TOKEN_URL.replace('/token', '')}`)
      .post('/token', {
        grant_type: 'authorization_code',
        code: bundle.inputData.code,
        audience: AUDIENCE,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
      .reply(200, {
        access_token: 'a_token',
        id_token: 'another_token'
      })

    appTester(App.authentication.oauth2Config.getAccessToken, bundle).then(result => {
      result.access_token.should.eql('a_token')
      result.id_token.should.eql('another_token')

      done()
    })
  })

  it('throws error if return status is not 200', done => {
    const bundle = {
      inputData: {
        code: 'one_time_code'
      }
    }

    const errorObject = {
      error: 'invalid_grant',
      error_description: 'Invalid authorization code'
    }

    nock(`${ACCESS_TOKEN_URL.replace('/token', '')}`)
      .post('/token', {
        grant_type: 'authorization_code',
        code: bundle.inputData.code,
        audience: AUDIENCE,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
      .reply(204, errorObject)

    // Disable global error handler which catches >= 400 errors to be able to test error thrown during authentication
    App.afterResponse = []

    appTester(App.authentication.oauth2Config.getAccessToken, bundle)
      .then(result => {
        should.not.exist(result)
        done()
      })
      .catch(error => {
        should.exist(error)
        done()
      })

    // result.access_token.should.eql('a_token');
    // result.id_token.should.eql('another_token');
  })

  it('includes the access token in future requests', done => {
    const bundle = {
      authData: {
        access_token: 'a_token'
      }
    }

    nock(`${AUTH_BASE_URL}`)
      .get('/userinfo')
      .reply(200, {
        sub: 'auth0|8547899',
        nickname: 'TonyJ',
        name: 'ajefts@topcoder.com',
        picture: 'https://s.gravatar.com/avatar/f11892c3814036c68c78f4ce0f6c8761?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Faj.png',
        updated_at: '2020-05-02T19:11:32.858Z'
      })

    appTester(App.authentication.test, bundle).then(result => {
      result.should.have.property('nickname')
      result.nickname.should.eql('TonyJ')

      done()
    })
  })

  it('throws error if access token is invalid', done => {
    const bundle = {
      authData: {
        access_token: 'a_token'
      }
    }

    nock(`${AUTH_BASE_URL}`)
      .get('/userinfo')
      .reply(401)

    appTester(App.authentication.test, bundle)
      .then(result => {
        should.not.exist(result)
        done()
      })
      .catch(error => {
        should.exist(error)
        done()
      })
  })
})
