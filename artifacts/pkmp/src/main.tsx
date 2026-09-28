import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// If running in Tauri, point api client to localhost:8080 (Express backend)
setBaseUrl('http://localhost:8080'); // running as web app

createRoot(document.getElementById('root')!).render(<App />);
