// this isn't used in the soultion. Only in the extra credit
import {server} from 'test/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
