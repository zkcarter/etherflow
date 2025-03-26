import { useState } from 'react'

export function ContractInterface() {
  const [contractAddress, setContractAddress] = useState('')
  const [abi, setAbi] = useState('')

  return (
    <div className="space-y-8">
      {/* 合约地址输入 */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">合约地址</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="输入合约地址 (0x...)"
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            验证
          </button>
        </div>
      </div>

      {/* ABI 输入 */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">ABI</h2>
        <div className="space-y-4">
          <textarea
            value={abi}
            onChange={(e) => setAbi(e.target.value)}
            placeholder="粘贴 ABI JSON 或上传 ABI 文件"
            className="h-32 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex items-center gap-4">
            <button className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90">
              上传 ABI 文件
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              解析 ABI
            </button>
          </div>
        </div>
      </div>

      {/* 合约接口列表 */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">合约接口</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="搜索接口..."
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <select className="rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="all">全部</option>
              <option value="read">读操作</option>
              <option value="write">写操作</option>
            </select>
          </div>
          
          {/* 接口列表将在这里显示 */}
          <div className="rounded-md border bg-muted/50 p-4 text-sm text-muted-foreground">
            请先输入合约地址并提供 ABI
          </div>
        </div>
      </div>
    </div>
  )
} 