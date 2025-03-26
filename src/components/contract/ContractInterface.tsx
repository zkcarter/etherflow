import { useState } from 'react'
import { ContractConfig } from '../../types/contract'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

interface ContractInterfaceProps {
  mode: 'view'
  contract: ContractConfig
}

type TabType = 'read' | 'write'

export function ContractInterface({ mode, contract }: ContractInterfaceProps) {
  const [activeTab, setActiveTab] = useState<TabType>('read')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAbiExpanded, setIsAbiExpanded] = useState(true)

  const formatAddress = (address: string) => {
    if (!address) return ''
    const addr = address.startsWith('0x') ? address : `0x${address}`
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="space-y-8">
      {/* 合约信息显示 */}
      <div className="flex items-center gap-8 rounded-lg border bg-card p-6">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">合约名称</span>
          <span className="font-medium">{contract.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">合约地址</span>
          <span className="font-medium">{formatAddress(contract.address)}</span>
        </div>
      </div>

      {/* ABI 显示 */}
      <div className="rounded-lg border bg-card">
        <div 
          className="flex cursor-pointer items-center justify-between border-b p-4 hover:bg-accent/50"
          onClick={() => setIsAbiExpanded(!isAbiExpanded)}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">ABI</h2>
            <span className="text-sm text-muted-foreground">
              {contract.abi ? '已配置' : '未配置'}
            </span>
          </div>
          <button
            className="rounded p-1 hover:bg-accent"
            title={isAbiExpanded ? '收起' : '展开'}
          >
            {isAbiExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {isAbiExpanded && (
          <div className="space-y-4 p-4">
            <pre className="overflow-auto rounded-md bg-gray-50 p-4 text-sm">
              {contract.abi}
            </pre>
          </div>
        )}
      </div>

      {/* 合约接口列表 */}
      <div className="rounded-lg border bg-card">
        {/* 搜索框 */}
        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索合约函数..."
              className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Tab 按钮 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('read')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'read'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            读操作
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'write'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            写操作
          </button>
        </div>

        {/* 函数列表 */}
        <div className="p-6">
          <div className="rounded-md border bg-muted/50 p-4 text-sm text-muted-foreground">
            暂无{activeTab === 'read' ? '读' : '写'}操作函数
          </div>
        </div>
      </div>
    </div>
  )
} 