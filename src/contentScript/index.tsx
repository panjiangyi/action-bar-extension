console.info('contentScript is rgaunning')
import React from 'react'
import ReactDOM from 'react-dom/client'
import '../assets/tailwind.css'
import { App } from './app'
const root = document.createElement('div')
root.classList.add('crx-root')
root.style.position = 'fixed'
root.style.inset = '0'
root.style.zIndex = '999'
root.style.pointerEvents = 'none'
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
document.body.appendChild(root)
