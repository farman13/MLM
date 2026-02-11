import { createRoot } from 'react-dom/client'
import "@rainbow-me/rainbowkit/styles.css";
import './index.css'

import App from './App.jsx'
import { RainbowKitRoot } from './components/provider/RainbowKitRoot.jsx'
import { PoolWeb3Provider } from './context/PoolWeb3Provider.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import { BrowserRouter } from "react-router-dom";
import { MLMWeb3Provider } from './context/MLMWeb3Provider.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <RainbowKitRoot>
      <AuthProvider>
        <MLMWeb3Provider>
          <PoolWeb3Provider>
            <App />
          </PoolWeb3Provider>
        </MLMWeb3Provider>
      </AuthProvider>
    </RainbowKitRoot>
  </BrowserRouter>
)

