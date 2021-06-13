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

const defaultState = {
  data: null,
  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  error: null,
  status: 'idle',
  run: expect.any(Function),
  reset: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
}

const pendingState = {
  ...defaultState,
  status: 'pending',
  isIdle: false,
  isLoading: true,
}

const resolvedState = {
  ...defaultState,
  status: 'resolved',
  isIdle: false,
  isSuccess: true,
}

const rejectedState = {
  ...defaultState,
  status: 'rejected',
  isIdle: false,
  isError: true,
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual(defaultState)

  let p
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual(pendingState)

  const dataMock = {data: 'data'}

  await act(async () => {
    resolve(dataMock)
    await p
  })

  expect(result.current).toEqual({
    ...resolvedState,
    data: dataMock,
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual(defaultState)
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(defaultState)

  let p
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual(pendingState)

  const error = new Error('error message')
  await act(async () => {
    reject(error)
    await p.catch(e => e)
  })

  expect(result.current).toEqual({
    ...rejectedState,
    error: error,
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
    ...defaultState,
    isIdle: false,
    isLoading: true,
    ...customInitialState,
  })
})

test('can set the data', () => {
  const {result} = renderHook(() => useAsync())

  const dataMock = {data: 'data'}
  act(() => {
    result.current.setData(dataMock)
  })

  expect(result.current).toEqual({
    ...resolvedState,
    data: dataMock,
  })
})

test('can set the error', () => {
  const {result} = renderHook(() => useAsync())

  const error = new Error('message')
  act(() => {
    result.current.setError(error)
  })

  expect(result.current).toEqual({
    ...rejectedState,
    error: error,
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
