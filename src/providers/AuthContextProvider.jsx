import { useState } from 'react'
import PropTypes from 'prop-types'

import { AuthContext } from '../contexts/AuthContext.js'

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}
