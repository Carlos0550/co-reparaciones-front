import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './AppContext.jsx'
import esES from 'antd/es/locale/es_ES';
import { ConfigProvider } from 'antd'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={esES}>
        <AppProvider>
          <App />
        </AppProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
