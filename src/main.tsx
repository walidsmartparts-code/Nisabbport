import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WebsiteDataProvider } from './context/WebsiteDataContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebsiteDataProvider>
      <App />
    </WebsiteDataProvider>
  </StrictMode>,
);

