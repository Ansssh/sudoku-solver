import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App2 from './App2.jsx'
import App from './App.jsx'
import App3 from './App3.jsx'
import 'remixicon/fonts/remixicon.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App3 />
  </StrictMode>,
)
