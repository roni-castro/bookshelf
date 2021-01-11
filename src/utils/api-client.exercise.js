const apiURL = process.env.REACT_APP_API_URL

async function client(endpoint, customConfig = {}) {
  const config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${customConfig.token}`,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
