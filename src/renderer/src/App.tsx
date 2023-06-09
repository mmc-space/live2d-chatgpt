import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import 'font-awesome/css/font-awesome.css'

import { GlobalStyles } from './styles/GlobalStyles'

import store from './store'

const Model = React.lazy(() => import('./pages/Model'))
const Setting = React.lazy(() => import('./pages/Setting'))

function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <GlobalStyles />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={null}>
                <Model />
              </Suspense>
            }
          />
          <Route
            path="/setting"
            element={
              <Suspense fallback={null}>
                <Setting />
              </Suspense>
            }
          />
        </Routes>
      </Provider>
    </HashRouter>
  )
}

export default App
