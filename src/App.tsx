import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { RootLayout } from './components/layout/RootLayout'
import { ContractInterface } from './components/contract/ContractInterface'
import { useState } from 'react'
import { Contract } from './types/contract'

const queryClient = new QueryClient()

function App() {
  const [selectedContract, setSelectedContract] = useState<Contract>()
  const [isAddingContract, setIsAddingContract] = useState(true)

  const handleSaveContract = (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContract: Contract = {
      ...contractData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    // 这里需要实现保存合约的逻辑
    console.log('Saving contract:', newContract)
    setIsAddingContract(false)
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RootLayout>
          <ContractInterface
            mode={isAddingContract ? 'add' : 'view'}
            contract={selectedContract}
            onSave={handleSaveContract}
          />
        </RootLayout>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
