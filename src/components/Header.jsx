import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'

import { User } from './User.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getUserInfo } from '../api/users.js'

export function Header() {
  const [token, setToken] = useAuth()
  const { sub } = token ? jwtDecode(token) : {}

  const userInfoQuery = useQuery({
    queryKey: ['users', sub],
    queryFn: () => getUserInfo(sub),
    enabled: Boolean(sub),
  })

  const userInfo = userInfoQuery.data

  if (token && userInfo) {
    return (
      <nav>
        Logged in as <User {...userInfo} />
        <br />
        <button onClick={() => setToken(null)}>Logout</button>
      </nav>
    )
  }

  return (
    <nav>
      <Link to='/login'>Log in</Link> | <Link to='/signup'>Sign Up</Link>
    </nav>
  )
}
