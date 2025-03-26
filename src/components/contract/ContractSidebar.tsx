import { useState } from 'react'
import { Contract } from '../../types/contract'
import { ChevronRight, ChevronLeft, Plus, Trash2, Edit2 } from 'lucide-react'

interface ContractSidebarProps {
  contracts: Contract[]
  selectedContract?: Contract
  onSelectContract: (contract: Contract) => void
  onDeleteContract: (contract: Contract) => void
  onUpdateContract: (contract: Contract) => void
  onAddContract: () => void
  className?: string
}

export function ContractSidebar({
  contracts,
  selectedContract,
  onSelectContract,
  onDeleteContract,
  onUpdateContract,
  onAddContract,
  className = '',
}: ContractSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [editingContract, setEditingContract] = useState<string>()
  const [editingName, setEditingName] = useState('')

  const handleStartEdit = (contract: Contract) => {
    setEditingContract(contract.id)
    setEditingName(contract.name)
  }

  const handleSaveEdit = (contract: Contract) => {
    if (editingName.trim()) {
      const updatedContract = {
        ...contract,
        name: editingName.trim(),
        updatedAt: Date.now(),
      }
      onUpdateContract(updatedContract)
    }
    setEditingContract(undefined)
  }

  const handleKeyDown = (e: React.KeyboardEvent, contract: Contract) => {
    if (e.key === 'Enter') {
      handleSaveEdit(contract)
    } else if (e.key === 'Escape') {
      setEditingContract(undefined)
      setEditingName(contract.name) // 恢复原始名称
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return ''
    // 确保地址以 0x 开头
    const addr = address.startsWith('0x') ? address : `0x${address}`
    // 保留 0x 前缀，显示接下来的 4 位和最后 4 位
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <aside className={`h-[calc(100vh-4rem)] ${className}`}>
      <div
        className={`flex h-full flex-col border-r bg-card transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className={`font-semibold ${isCollapsed ? 'hidden' : 'block'}`}>合约列表</h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-md p-1 hover:bg-accent"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className={`group flex flex-col border-b hover:bg-accent ${
                selectedContract?.id === contract.id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center justify-between p-3">
                {editingContract === contract.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleSaveEdit(contract)}
                    onKeyDown={(e) => handleKeyDown(e, contract)}
                    className="flex-1 rounded-md border bg-background px-2 py-1 text-sm"
                    autoFocus
                  />
                ) : (
                  <button
                    className="flex flex-col items-start"
                    onClick={() => onSelectContract(contract)}
                    title={isCollapsed ? contract.name : undefined}
                  >
                    <span className="truncate font-medium">
                      {isCollapsed ? contract.name.slice(0, 2) : contract.name}
                    </span>
                    {!isCollapsed && (
                      <span className="text-xs text-muted-foreground">
                        {formatAddress(contract.address)}
                      </span>
                    )}
                  </button>
                )}
                {!isCollapsed && !editingContract && (
                  <div className="invisible flex items-center gap-1 group-hover:visible">
                    <button
                      onClick={() => handleStartEdit(contract)}
                      className="rounded p-1 hover:bg-accent-foreground/10"
                      title="修改名称"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteContract(contract)}
                      className="rounded p-1 hover:bg-destructive hover:text-destructive-foreground"
                      title="删除合约"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onAddContract}
          className="flex items-center justify-center gap-2 border-t p-4 hover:bg-accent"
        >
          <Plus size={20} />
          {!isCollapsed && <span>新增合约</span>}
        </button>
      </div>
    </aside>
  )
} 