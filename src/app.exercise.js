/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

function App() {
  const [user, setUser] = React.useState(null)

  async function login(formData) {
    try {
      const user = await auth.login(formData)
      setUser(user)
    } catch (err) {
      console.warn(err)
    }
  }

  async function register(formData) {
    try {
      const user = await auth.register(formData)
      setUser(user)
    } catch (err) {
      console.warn(err)
    }
  }

  async function logout() {
    try {
      setUser(null)
      await auth.logout()
    } catch (err) {
      console.warn(err)
    }
  }

  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
