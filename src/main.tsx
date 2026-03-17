import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import App from "./App.tsx";
  import "./index.css";
  import { CartProvider } from "./context/CartContext";


  const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </CartProvider>
  </StrictMode>
);
  // createRoot(document.getElementById("root")!).render(<App />);
  