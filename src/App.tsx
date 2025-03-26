import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { RootLayout } from './components/layout/RootLayout'
import { ContractInterface } from './components/contract/ContractInterface'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RootLayout>
          <ContractInterface />
        </RootLayout>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
