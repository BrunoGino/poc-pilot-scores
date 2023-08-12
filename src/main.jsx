import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PilotStore } from "./stores/PilotStore";

const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      } // 5min,
    }
  }
);


const pilotStore = new PilotStore(queryClient);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App store={pilotStore}/>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
)
