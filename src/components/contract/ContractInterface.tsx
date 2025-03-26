import { useState } from 'react'
import { Contract, ContractFunction } from '../../types/contract'
import { Search, Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react'

interface ContractInterfaceProps {
  mode: 'add' | 'view'
  contract?: Contract
  onSave?: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => void
}

type TabType = 'read' | 'write'

interface ValidationErrors {
  name?: string
  address?: string
  abi?: string
}

export function ContractInterface({ mode, contract, onSave }: ContractInterfaceProps) {
  const [name, setName] = useState(contract?.name ?? '')
  const [address, setAddress] = useState(contract?.address ?? '')
  const [abi, setAbi] = useState(contract?.abi ?? '')
  const [functions, setFunctions] = useState<ContractFunction[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('read')
  const [searchTerm, setSearchTerm] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isAbiExpanded, setIsAbiExpanded] = useState(true)

  const validateAddress = (address: string) => {
    if (!address) return '请输入合约地址'
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return '请输入有效的合约地址'
    return ''
  }

  const validateAbi = (abi: string) => {
    if (!abi) return '请输入 ABI'
    try {
      JSON.parse(abi)
      return ''
    } catch (error) {
      return 'ABI 格式无效'
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return ''
    const addr = address.startsWith('0x') ? address : `0x${address}`
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleSave = () => {
    const newErrors: ValidationErrors = {}

    if (!name.trim()) {
      newErrors.name = '请输入合约名称'
    }

    const addressError = validateAddress(address)
    if (addressError) {
      newErrors.address = addressError
    }

    const abiError = validateAbi(abi)
    if (abiError) {
      newErrors.abi = abiError
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0 && onSave) {
      onSave({
        name: name.trim(),
        address,
        abi,
      })
    }
  }

  const handleParseAbi = () => {
    const abiError = validateAbi(abi)
    if (abiError) {
      setErrors(prev => ({ ...prev, abi: abiError }))
      return
    }

    try {
      const parsedAbi = JSON.parse(abi)
      console.log('Parsed ABI:', parsedAbi)
      setErrors(prev => ({ ...prev, abi: undefined }))
    } catch (error) {
      setErrors(prev => ({ ...prev, abi: 'ABI 解析失败' }))
    }
  }

  return (
    <div className="space-y-8">
      {mode === 'view' ? (
        // 查看模式下的合约信息显示
        <div className="flex items-center gap-8 rounded-lg border bg-card p-6">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">合约名称</span>
            <span className="font-medium">{name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">合约地址</span>
            <span className="font-medium">{formatAddress(address)}</span>
          </div>
        </div>
      ) : (
        // 添加模式下的输入表单
        <>
          {/* 合约名称输入 */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">合约名称</h2>
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrors(prev => ({ ...prev, name: undefined }))
                }}
                placeholder="输入合约名称"
                disabled={mode === 'view'}
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
          </div>

          {/* 合约地址输入 */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">合约地址</h2>
            <div className="space-y-2">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    setErrors(prev => ({ ...prev, address: undefined }))
                  }}
                  placeholder="输入合约地址 (0x...)"
                  disabled={mode === 'view'}
                  className={`flex-1 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.address ? 'border-red-500' : ''
                  }`}
                />
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  验证
                </button>
              </div>
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>
          </div>
        </>
      )}

      {/* ABI 输入/显示 */}
      <div className="rounded-lg border bg-card">
        <div 
          className="flex cursor-pointer items-center justify-between border-b p-4 hover:bg-accent/50"
          onClick={() => setIsAbiExpanded(!isAbiExpanded)}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">ABI</h2>
            {mode === 'view' && (
              <span className="text-sm text-muted-foreground">
                {abi ? '已配置' : '未配置'}
              </span>
            )}
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
            <div className="space-y-2">
              <textarea
                value={abi}
                onChange={(e) => {
                  setAbi(e.target.value)
                  setErrors(prev => ({ ...prev, abi: undefined }))
                }}
                placeholder="粘贴 ABI JSON 或上传 ABI 文件"
                disabled={mode === 'view'}
                className={`h-32 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.abi ? 'border-red-500' : ''
                }`}
              />
              {errors.abi && <p className="text-sm text-red-500">{errors.abi}</p>}
            </div>
            {mode === 'add' && (
              <div className="flex items-center gap-4">
                <button className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90">
                  上传 ABI 文件
                </button>
                <button
                  onClick={handleParseAbi}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  解析 ABI
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 合约接口列表 */}
      {(mode === 'view' || functions.length > 0) && (
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
      )}

      {/* 保存按钮 */}
      {mode === 'add' && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            保存合约
          </button>
        </div>
      )}
    </div>
  )
} 