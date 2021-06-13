import {renderHook, act} from '@testing-library/react-hooks'
import {useAsync} from '../hooks'

beforeEach(() => {
  jest.spyOn(console, 'error')
})

afterEach(() => {
  console.error.mockRestore()
})

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())
  const initialState = {
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
    status: 'idle',
    error: null,
    data: null,
    setError: expect.any(Function),
    setData: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  }
  expect(result.current).toEqual(initialState)

  act(() => {
    result.current.run(promise)
  })

  const responseData = {data: 'data'}

  await act(async () => {
    resolve(responseData)
    await promise
  })

  expect(result.current).toEqual({
    ...initialState,
    isIdle: false,
    isSuccess: true,
    status: 'resolved',
    data: responseData,
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual(initialState)
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual({
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
    status: 'idle',
    error: null,
    data: null,
    setError: expect.any(Function),
    setData: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  let promiseReturned
  act(() => {
    promiseReturned = result.current.run(promise)
  })

  const error = new Error('error message')

  await act(async () => {
    reject(error)
    await promiseReturned.catch(e => e)
  })

  expect(result.current).toEqual({
    isIdle: false,
    isLoading: false,
    isError: true,
    isSuccess: false,
    status: 'rejected',
    error: error,
    data: null,
    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('can specify an initial state', () => {
  const customInitialState = {
    status: 'pending',
    data: undefined,
    error: undefined,
  }
  const {result} = renderHook(() => useAsync(customInitialState))

  expect(result.current).toEqual({
    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,
    status: 'pending',
    error: undefined,
    data: undefined,
    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('can set the data', () => {
  const {result} = renderHook(() => useAsync())

  const data = {data: 'data'}
  act(() => {
    result.current.setData(data)
  })

  expect(result.current).toEqual({
    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'resolved',
    error: null,
    data: data,
    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('can set the error', () => {
  const {result} = renderHook(() => useAsync())

  const error = new Error('message')
  act(() => {
    result.current.setError(error)
  })

  expect(result.current).toEqual({
    isIdle: false,
    isLoading: false,
    isError: true,
    isSuccess: false,
    status: 'rejected',
    error: error,
    data: null,
    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())

  let p
  act(() => {
    p = result.current.run(promise)
  })
  unmount()
  await act(async () => {
    resolve()
    await p
  })

  expect(console.error).not.toHaveBeenCalled()
})

test('calling "run" without a promise results in an early error', () => {
  const {result} = renderHook(() => useAsync())

  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
