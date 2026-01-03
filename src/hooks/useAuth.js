import { useContext } from 'react'

import { AuthContext } from '../contexts/AuthContext.js'

export function useAuth() {
  const { token, setToken } = useContext(AuthContext)
  return [token, setToken]
}
