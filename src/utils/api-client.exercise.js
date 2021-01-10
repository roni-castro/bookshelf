async function client(endpoint, customConfig = {}) {
  const fullUrl = `${process.env.REACT_APP_API_URL}/${endpoint}`
  return new Promise((resolve, reject) => {
    window
      .fetch(fullUrl, customConfig)
      .then(async response => {
        const data = await response.json()
        if (response.ok) {
          resolve(data)
        } else {
          reject(data)
        }
      })
      .catch(error => reject(error))
  })
}

export {client}
