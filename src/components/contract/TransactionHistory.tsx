import { useState, useEffect } from 'react'
import { useNetwork } from 'wagmi'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { formatEther } from 'viem'
import { Button } from '../ui/Button'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

interface Transaction {
  hash: string
  timestamp: number
  from: string
  to: string
  value: bigint
  functionName: string
  args: any[]
  status: 'success' | 'failed' | 'pending'
}

interface TransactionHistoryProps {
  contractAddress: string
  transactions: Transaction[]
}

export function TransactionHistory({ contractAddress, transactions }: TransactionHistoryProps) {
  const { chain } = useNetwork()
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  // 格式化地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // 获取交易浏览器链接
  const getExplorerUrl = (hash: string) => {
    if (!chain?.blockExplorers?.default?.url) return ''
    return `${chain.blockExplorers.default.url}/tx/${hash}`
  }

  // 获取状态标签样式
  const getStatusStyle = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">交易历史</h2>
      
      <div className="divide-y divide-gray-100 rounded-lg border bg-card">
        {transactions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            暂无交易记录
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.hash} className="space-y-2 p-4">
              {/* 交易概览 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-xs ${getStatusStyle(tx.status)}`}>
                    {tx.status === 'success' ? '成功' : tx.status === 'failed' ? '失败' : '处理中'}
                  </span>
                  <span className="font-medium">{tx.functionName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(tx.timestamp * 1000), {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedTx(expandedTx === tx.hash ? null : tx.hash)}
                  >
                    {expandedTx === tx.hash ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </Button>
                </div>
              </div>

              {/* 交易详情 */}
              {expandedTx === tx.hash && (
                <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">发送方</span>
                    <span>{formatAddress(tx.from)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">接收方</span>
                    <span>{formatAddress(tx.to)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">数值</span>
                    <span>{formatEther(tx.value)} ETH</span>
                  </div>
                  {tx.args.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-gray-500">参数</span>
                      <pre className="overflow-x-auto rounded bg-gray-100 p-2">
                        {JSON.stringify(tx.args, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <a
                      href={getExplorerUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                    >
                      查看详情
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 