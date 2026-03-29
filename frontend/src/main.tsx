import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx'
import { Provider } from 'react-redux';
import { store} from './store/store.ts';
import { Toaster } from 'sonner';       

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <TooltipProvider>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      <App />
      <Toaster position="top-center" richColors closeButton />
    </ThemeProvider>
    </TooltipProvider>
    </Provider>
  </React.StrictMode>
);
