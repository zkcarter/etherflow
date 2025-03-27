import { useState, useEffect } from 'react'
import { useChainId, useChains, useWaitForTransactionReceipt } from 'wagmi'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { formatEther } from 'viem'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Alert, AlertTitle, AlertDescription } from '../ui/Alert'
import { Loader2, ExternalLink, CheckCircle, XCircle } from 'lucide-react'

interface TransactionDetailsProps {
  hash?: `0x${string}`
  onClose?: () => void
}

export function TransactionDetails({ hash, onClose }: TransactionDetailsProps) {
  const chainId = useChainId()
  const chains = useChains()
  const [customGasPrice, setCustomGasPrice] = useState('')
  const [customGasLimit, setCustomGasLimit] = useState('')

  // 获取当前链的配置
  const currentChain = chains.find(chain => chain.id === chainId)

  // 监听交易状态
  const { 
    data: receipt,
    isError: isTransactionError,
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccess,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    }
  })

  // 获取区块浏览器 URL
  const getExplorerUrl = () => {
    if (!hash || !currentChain?.blockExplorers?.default?.url) return ''
    return `${currentChain.blockExplorers.default.url}/tx/${hash}`
  }

  // 获取交易状态图标
  const getStatusIcon = () => {
    if (isTransactionLoading) return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    if (isTransactionSuccess) return <CheckCircle className="h-6 w-6 text-green-500" />
    if (isTransactionError) return <XCircle className="h-6 w-6 text-red-500" />
    return null
  }

  // 获取交易状态文本
  const getStatusText = () => {
    if (isTransactionLoading) return '交易确认中...'
    if (isTransactionSuccess) return '交易已确认'
    if (isTransactionError) return '交易失败'
    return '等待交易发送'
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* 交易状态 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
        {hash && (
          <a
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
          >
            查看详情
            <ExternalLink size={16} />
          </a>
        )}
      </div>

      {/* 交易详情 */}
      {receipt && (
        <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">区块高度</span>
            <span>{receipt.blockNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Gas 使用量</span>
            <span>{receipt.gasUsed?.toString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">实际 Gas 价格</span>
            <span>{formatEther(receipt.effectiveGasPrice)} ETH</span>
          </div>
        </div>
      )}

      {/* Gas 配置 */}
      <div className="space-y-2">
        <h3 className="font-medium">Gas 配置</h3>
        <div className="grid gap-2">
          <div className="space-y-1">
            <label className="text-sm">Gas 价格 (Gwei)</label>
            <Input
              type="number"
              value={customGasPrice}
              onChange={(e) => setCustomGasPrice(e.target.value)}
              placeholder="自动"
              min="0"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Gas 限制</label>
            <Input
              type="number"
              value={customGasLimit}
              onChange={(e) => setCustomGasLimit(e.target.value)}
              placeholder="自动"
              min="21000"
            />
          </div>
        </div>
      </div>

      {/* 关闭按钮 */}
      {onClose && (
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full"
        >
          关闭
        </Button>
      )}
    </div>
  )
} 