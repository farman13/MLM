import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@rainbow-me/rainbowkit/styles.css";
import './index.css'

import App from './App.jsx'
import { RainbowKitRoot } from './components/provider/RainbowKitRoot.jsx'
import { PoolWeb3Provider } from './context/PoolWeb3Provider.jsx';
import AuthProvider from './context/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <RainbowKitRoot>
    <AuthProvider>
      <PoolWeb3Provider>
        <App />
      </PoolWeb3Provider>
    </AuthProvider>
  </RainbowKitRoot>
)

