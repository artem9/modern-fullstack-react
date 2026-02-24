import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation as useGraphQLMutation } from '@apollo/client/react'

import { useAuth } from '../hooks/useAuth.js'
import { LOGIN_USER } from '../api/graphql/users.js'

export function Login() {
  const [, setToken] = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [loginUser, { loading }] = useGraphQLMutation(LOGIN_USER, {
    variables: { username, password },
    onCompleted: (data) => {
      setToken(data.loginUser)
      navigate('/')
    },
    onError: () => alert('failed to login!'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    loginUser()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Link to='/'>Back to main page</Link>
      <hr />
      <br />
      <div>
        <label htmlFor='login-username'>Username: </label>
        <input
          type='text'
          name='login-username'
          id='login-username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='login-password'>Password: </label>
        <input
          type='password'
          name='login-password'
          id='login-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={loading ? 'Logging in...' : 'Log In'}
        disabled={!username || !password || loading}
      />
    </form>
  )
}
