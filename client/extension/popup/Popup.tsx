/// <reference types="chrome" />
import { createRoot } from 'react-dom/client';
import PopupContent from './PopupContent'; // Split for clarity

const root = createRoot(document.getElementById('root')!);
root.render(<PopupContent />);