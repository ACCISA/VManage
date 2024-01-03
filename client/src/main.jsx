import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from "react-auth-kit"
import { BrowserRouter } from "react-router-dom"
import { ReactNotifications } from 'react-notifications-component'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={false}>
      <BrowserRouter>
        <ReactNotifications />
        <App />
      </BrowserRouter>
    </AuthProvider>

  </React.StrictMode>,
)
