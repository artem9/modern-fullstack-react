import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { App } from './App.jsx'
import { routes } from './routes.jsx'

const router = createBrowserRouter(routes)

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>,
)
