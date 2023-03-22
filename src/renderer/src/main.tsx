import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './utils/ga'

const render = (Component: React.ComponentType) => {
  const root = document.getElementById('root')
  if (!root) throw new Error('Mount element not found')
  ReactDOM.createRoot(root).render(<Component />)
}

render(App)
