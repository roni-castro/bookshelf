import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import React from 'react'
import * as usersDB from 'test/data/users'
import {buildUser} from 'test/generate'

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])

const AllTheProviders = ({children}) => {
  return <AppProviders>{children}</AppProviders>
}

async function customRender(
  ui,
  {route = '/list', user, ...renderOptions} = {},
) {
  // if you want to render the app unauthenticated then pass "null" as the user
  user = typeof user === 'undefined' ? await loginAsUser() : user
  window.history.pushState({}, 'Test page', route)

  const returnValue = {
    ...render(ui, {wrapper: AllTheProviders, ...renderOptions}),
    user,
  }

  await waitForLoadingToFinish()

  return returnValue
}

async function loginAsUser(userProperties) {
  const user = buildUser(userProperties)
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)
  return authUser
}

// re-export everything
export * from '@testing-library/react'
// override render method
export {customRender as render, waitForLoadingToFinish}
