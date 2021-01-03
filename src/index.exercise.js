import React from 'react'
import ReactDOM from 'react-dom'
import {Logo} from './components/logo'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

const ModalState = {
  None: 'none',
  Login: 'login',
  Register: 'register',
}

function AuthForm({onSubmit, buttonText}) {
  function handleOnSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements
    onSubmit({
      username: username.value,
      password: password.value,
    })
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <div>
        <div>
          <label htmlFor="username">Username: </label>
          <input autoComplete="true" id="username" type="text" />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            autoComplete="current-password"
            id="password"
            type="password"
          />
        </div>
        <div>
          <button type="submit">{buttonText}</button>
        </div>
      </div>
    </form>
  )
}

function App() {
  const [openModal, setOpenModal] = React.useState(ModalState.None)
  const openLogin = () => setOpenModal(ModalState.Login)
  const openRegister = () => setOpenModal(ModalState.Register)
  const closeModal = () => setOpenModal(ModalState.None)

  function handleLogin(formData) {
    console.log('login', formData)
  }

  function handleRegister(formData) {
    console.log('register', formData)
  }

  return (
    <div>
      <Logo width={80} height={80} />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={openLogin}>Login</button>
        <button onClick={openRegister}>Register</button>
      </div>
      <Dialog
        aria-label="dialog to login"
        isOpen={openModal === 'login'}
        onDismiss={closeModal}
      >
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Login</h3>
        <AuthForm onSubmit={handleLogin} buttonText="Login" />
      </Dialog>
      <Dialog
        aria-label="dialog to register a new user"
        isOpen={openModal === 'register'}
        onDismiss={closeModal}
      >
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Register</h3>
        <AuthForm onSubmit={handleRegister} buttonText="Register" />
      </Dialog>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
