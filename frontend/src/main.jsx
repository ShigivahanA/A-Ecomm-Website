import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import { ToastProvider } from './components/ToastProvider.jsx'
import NavigationLoader from "./components/NavigationLoader";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ToastProvider>
      <ShopContextProvider>
          <NavigationLoader />
          <App />
      </ShopContextProvider>
    </ToastProvider>
  </BrowserRouter>,
)
