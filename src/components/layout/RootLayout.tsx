import { ReactNode, useState } from 'react'
import { Contract } from '../../types/contract'
import { ContractSidebar } from '../contract/ContractSidebar'
import { ContractInterface } from '../contract/ContractInterface'

interface RootLayoutProps {
  children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContract, setSelectedContract] = useState<Contract>()
  const [isAddingContract, setIsAddingContract] = useState(false)

  const handleAddContract = () => {
    setIsAddingContract(true)
  }

  const handleSaveContract = (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContract: Contract = {
      ...contractData,
      id: `contract-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setContracts([...contracts, newContract])
    setIsAddingContract(false)
    setSelectedContract(newContract)
  }

  const handleUpdateContract = (updatedContract: Contract) => {
    const newContracts = contracts.map((c) => 
      c.id === updatedContract.id ? updatedContract : c
    )
    setContracts(newContracts)
    if (selectedContract?.id === updatedContract.id) {
      setSelectedContract(updatedContract)
    }
  }

  const handleDeleteContract = (contract: Contract) => {
    setContracts(contracts.filter((c) => c.id !== contract.id))
    if (selectedContract?.id === contract.id) {
      setSelectedContract(undefined)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">EtherFlow</h1>
            {/* 网络选择器将在这里 */}
          </div>
          <div className="flex items-center gap-4">
            {/* 钱包连接按钮将在这里 */}
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="flex flex-1">
        {/* 左侧边栏 */}
        <ContractSidebar
          contracts={contracts}
          selectedContract={selectedContract}
          onSelectContract={setSelectedContract}
          onDeleteContract={handleDeleteContract}
          onUpdateContract={handleUpdateContract}
          onAddContract={handleAddContract}
        />

        {/* 主内容区域 */}
        <main className="flex-1 p-8">
          {isAddingContract ? (
            <ContractInterface mode="add" onSave={handleSaveContract} />
          ) : selectedContract ? (
            <ContractInterface 
              mode="view" 
              contract={selectedContract} 
              key={selectedContract.updatedAt}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              请选择或添加一个合约
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 