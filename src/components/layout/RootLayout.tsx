import { ReactNode, useState, useCallback } from 'react'
import { ContractConfig } from '../../types/contract'
import { ContractSidebar } from '../contract/ContractSidebar'
import { ContractInterface } from '../contract/ContractInterface'
import { WalletConnect } from '../wallet/WalletConnect'
import { useContracts } from '../../hooks/useContracts'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

interface RootLayoutProps {
  children: ReactNode
}

// 自定义拖拽手柄组件
function ResizeHandle() {
  return (
    <PanelResizeHandle className="w-1 hover:w-1.5 bg-transparent hover:bg-gray-200 transition-all duration-150 cursor-col-resize" />
  )
}

export function RootLayout({ children }: RootLayoutProps) {
  const { 
    contracts, 
    addContract, 
    updateContract, 
    deleteContract, 
    toggleFavorite,
    reorderContracts,
    loading,
    error 
  } = useContracts()
  
  const [selectedContract, setSelectedContract] = useState<ContractConfig>()

  // 处理选择合约
  const handleSelectContract = useCallback((contract: ContractConfig | undefined) => {
    setSelectedContract(contract)
  }, [])

  // 处理添加合约
  const handleAddContract = useCallback(async (
    name: string,
    address: string,
    abi: string,
    description?: string
  ) => {
    return addContract(name, address, abi, description)
  }, [addContract])

  // 处理更新合约
  const handleUpdateContract = useCallback(async (
    id: string,
    updates: Partial<ContractConfig>
  ) => {
    return updateContract(id, updates)
  }, [updateContract])

  // 处理删除合约
  const handleDeleteContract = useCallback(async (
    contractId: string
  ) => {
    return deleteContract(contractId)
  }, [deleteContract])

  // 处理收藏切换
  const handleToggleFavorite = useCallback(async (
    contractId: string
  ) => {
    return toggleFavorite(contractId)
  }, [toggleFavorite])

  // 处理重新排序
  const handleReorder = useCallback(async (
    newContracts: ContractConfig[]
  ) => {
    await reorderContracts(newContracts)
  }, [reorderContracts])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">加载中...</div>
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">EtherFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="flex-1 flex">
        <PanelGroup direction="horizontal" className="w-full">
          <Panel defaultSize={20} minSize={15} maxSize={40} className="h-[calc(100vh-4rem)]">
            <ContractSidebar
              contracts={contracts}
              selectedContract={selectedContract}
              onSelectContract={handleSelectContract}
              onToggleFavorite={handleToggleFavorite}
              onDeleteContract={handleDeleteContract}
              onAddContract={handleAddContract}
              onUpdateContract={handleUpdateContract}
              onReorder={handleReorder}
            />
          </Panel>
          <ResizeHandle />
          <Panel className="h-[calc(100vh-4rem)]">
            <main className="h-full p-8">
              {selectedContract ? (
                <ContractInterface 
                  mode="view" 
                  contract={selectedContract}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  请选择或添加一个合约
                </div>
              )}
            </main>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
} 