const { AUDIENCE, AUTH_BASE_URL, CLIENT_ID, CLIENT_SECRET } = process.env

const AUTH_URL = AUTH_BASE_URL + '/authorize'
const ACCESS_TOKEN_URL = AUTH_BASE_URL + '/oauth/token'
const USER_INFO = AUTH_BASE_URL + '/userinfo'
const SCOPE = 'offline_access openid profile refresh_token'

const getAccessToken = (z, bundle) => {
  const promise = z.request(`${ACCESS_TOKEN_URL}`, {
    method: 'POST',
    body: {
      grant_type: 'authorization_code',
      code: bundle.inputData.code,
      redirect_uri: bundle.inputData.redirect_uri,
      audience: AUDIENCE,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    },
    headers: {
      'content-type': 'application/json'
    }
  })

  return promise.then((response) => {
    if (response.status !== 200) {
      return Promise.reject(new Error('Unable to fetch access token: ' + response.content))
    }

    const result = JSON.parse(response.content)
    return {
      access_token: result.access_token,
      // For future use if required. Can be safely commented out
      id_token: result.id_token
    }
  })
}

const testAuth = (z, bundle) => {
  const promise = z.request({
    method: 'GET',
    url: USER_INFO
  })

  return promise.then((response) => {
    if (response.status === 401) {
      return Promise.reject(new Error('The access token you supplied is not valid'))
    }
    return z.JSON.parse(response.content)
  })
}

module.exports = {
  type: 'oauth2',
  oauth2Config: {
    authorizeUrl: {
      url: AUTH_URL,
      params: {
        scope: SCOPE,
        client_id: CLIENT_ID,
        audience: AUDIENCE,
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code'
      }
    },
    getAccessToken: getAccessToken,
    autoRefresh: true
  },
  test: testAuth,
  connectionLabel: '{{nickname}}'
}
