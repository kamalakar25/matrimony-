import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Bootstrap CSS
import 'react-toastify/dist/ReactToastify.css'; // ✅ Toastify CSS

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(<App />);