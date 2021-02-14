import * as React from 'react'
import * as auth from 'auth-provider'
import {queryCache} from 'react-query'
import {FullPageSpinner, FullPageErrorFallback} from '.././components/lib'
import {client} from '.././utils/api-client'
import {useAsync} from '.././utils/hooks'

const AuthContext = React.createContext()

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthContext provider`)
  }
  return context
}

function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    status,
    setData,
  } = useAsync()

  async function getUser() {
    let user = null

    const token = await auth.getToken()
    if (token) {
      const data = await client('me', {token})
      user = data.user
    }

    return user
  }

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    queryCache.clear()
    setData(null)
  }

  React.useEffect(() => {
    run(getUser())
  }, [run])

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    const value = {
      user,
      login,
      register,
      logout,
    }
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

export {AuthProvider, useAuth}
