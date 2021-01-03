import React from 'react'
import ReactDOM from 'react-dom'
import {Logo} from './components/logo'

function App() {
  return (
    <div>
      <Logo width={80} height={80} />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => alert('login')}>Login</button>
        <button onClick={() => alert('register')}>Register</button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
