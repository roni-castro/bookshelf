import {server, rest} from 'test/server'
import {client} from '../api-client'

const apiURL = process.env.REACT_APP_API_URL

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const response = await client(endpoint)
  expect(response).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  const endpoint = 'test-endpoint'
  let request
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json({}))
    }),
  )

  const token = 'abcd'
  await client(endpoint, {token})
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  const endpoint = 'test-endpoint'
  let request
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json({}))
    }),
  )

  await client(endpoint, {
    mode: 'cors',
    headers: {user: '123456'},
  })
  expect(request.headers.get('user')).toBe('123456')
  expect(request.mode).toBe('cors')
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const endpoint = 'test-endpoint'
  let request
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(req.body))
    }),
  )

  const data = {name: 'name'}
  await client(endpoint, {
    data,
  })
  expect(request.method).toBe('POST')
  expect(request.body).toEqual(data)
})
