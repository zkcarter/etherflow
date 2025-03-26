import { useAccount, useBalance, useChainId, useConfig } from 'wagmi'
import { Button } from '../ui/Button'
import { formatAddress } from '../../utils/format'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const { data: balance } = useBalance({
    address,
  })
  const chainId = useChainId()
  const config = useConfig()
  const currentChain = config.chains.find(x => x.id === chainId)

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {/* 网络信息 */}
        {currentChain && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-700">
              {currentChain.name}
            </span>
          </div>
        )}

        {/* 账户信息 */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
          {/* 余额 */}
          {balance && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">
                {Number(balance.formatted).toFixed(4)}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {balance.symbol}
              </span>
            </div>
          )}
          
          {/* 分隔符 */}
          <div className="w-px h-4 bg-gray-200" />
          
          {/* 地址 */}
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(address)}
          </span>
        </div>

        {/* 断开连接按钮 */}
        <Button
          size="sm"
          variant="outline"
          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          onClick={() => open()}
        >
          断开连接
        </Button>
      </div>
    )
  }

  return (
    <Button
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
      onClick={() => open()}
    >
      连接钱包
    </Button>
  )
} 