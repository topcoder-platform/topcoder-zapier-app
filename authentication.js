const getAccessToken = (z, bundle) => {
  const promise = z.request(`${process.env.ACCESS_TOKEN_URL}`, {
    method: 'POST',
    body: {
      grant_type: 'authorization_code',
      code: bundle.inputData.code,
      redirect_uri: bundle.inputData.redirect_uri,
      audience: process.env.AUDIENCE,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
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
    url: `${process.env.USER_INFO}`
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
      url: '{{process.env.AUTH_URL}}',
      params: {
        scope: '{{process.env.SCOPE}}',
        client_id: '{{process.env.CLIENT_ID}}',
        audience: '{{process.env.AUDIENCE}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code'
      }
    },
    getAccessToken: getAccessToken,
    autoRefresh: false
  },
  test: testAuth,
  connectionLabel: '{{nickname}}'
}
