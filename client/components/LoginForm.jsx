import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ loginFunction }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = event => {
    event.preventDefault()
    loginFunction(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={ handleLogin } id="#login-form">
      <div id="div-login-username">
                username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={ ({ target }) => setUsername(target.value) }
        />
      </div>
      <div id="div-login-password">
                password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={ ({ target }) => setPassword(target.value) }
        />
      </div>
      <button type="submit" id="button-login">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  loginFunction: PropTypes.func.isRequired
}

export default LoginForm
