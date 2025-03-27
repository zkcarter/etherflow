import { useState, useMemo } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { formatAbiItem } from 'abitype'
import { ContractConfig } from '../../types/contract'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs'
import { Search, Filter, Settings } from 'lucide-react'
import { FunctionForm } from './FunctionForm'
import { TransactionDetails } from './TransactionDetails'

interface ContractInterfaceProps {
  contract: ContractConfig
}

// ABI 函数类型定义
type AbiFunction = {
  name: string
  type: string
  stateMutability: string
  inputs: {
    name: string
    type: string
    components?: any[]
  }[]
  outputs?: {
    name: string
    type: string
    components?: any[]
  }[]
}

export function ContractInterface({ contract }: ContractInterfaceProps) {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFunction, setSelectedFunction] = useState<AbiFunction | null>(null)
  const [activeTransaction, setActiveTransaction] = useState<`0x${string}` | undefined>()

  // 解析 ABI
  const parsedAbi = useMemo(() => {
    try {
      const parsed = JSON.parse(contract.abi)
      // 确保解析后的结果是数组
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('ABI 解析错误:', e)
      return []
    }
  }, [contract.abi])

  // 过滤函数
  const functions = useMemo(() => {
    return parsedAbi.filter((item: any) => {
      if (!item || typeof item !== 'object') return false
      return item.type === 'function' &&
        item.name &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [parsedAbi, searchTerm])

  // 分类函数
  const { readFunctions, writeFunctions } = useMemo(() => {
    return functions.reduce((acc: { readFunctions: AbiFunction[], writeFunctions: AbiFunction[] }, func: AbiFunction) => {
      if (!func.stateMutability) return acc
      if (['view', 'pure'].includes(func.stateMutability)) {
        acc.readFunctions.push(func)
      } else {
        acc.writeFunctions.push(func)
      }
      return acc
    }, { readFunctions: [], writeFunctions: [] })
  }, [functions])

  // 处理函数选择
  const handleFunctionSelect = (func: AbiFunction) => {
    setSelectedFunction(func)
    setActiveTransaction(undefined) // 清除之前的交易状态
  }

  return (
    <div className="flex h-full">
      {/* 左侧函数列表 */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* 顶部搜索栏 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="搜索函数..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter size={20} />
              </Button>
              <Button variant="outline" size="sm">
                <Settings size={20} />
              </Button>
            </div>
          </div>

          {/* 函数列表 */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="read" className="h-full">
              <div className="border-b border-gray-200">
                <TabsList className="px-4">
                  <TabsTrigger value="read">
                    读操作 ({readFunctions.length})
                  </TabsTrigger>
                  <TabsTrigger value="write">
                    写操作 ({writeFunctions.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="h-[calc(100%-48px)] overflow-auto">
                <TabsContent value="read" className="p-0 m-0">
                  <div className="divide-y divide-gray-100">
                    {readFunctions.map((func: AbiFunction) => (
                      <div
                        key={func.name}
                        className={`
                          p-4 hover:bg-gray-50 cursor-pointer
                          ${selectedFunction?.name === func.name ? 'bg-gray-50' : ''}
                        `}
                        onClick={() => handleFunctionSelect(func)}
                      >
                        <div className="font-medium">{func.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatAbiItem(func as any)}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="write" className="p-0 m-0">
                  <div className="divide-y divide-gray-100">
                    {writeFunctions.map((func: AbiFunction) => (
                      <div
                        key={func.name}
                        className={`
                          p-4 hover:bg-gray-50 cursor-pointer
                          ${selectedFunction?.name === func.name ? 'bg-gray-50' : ''}
                        `}
                        onClick={() => handleFunctionSelect(func)}
                      >
                        <div className="font-medium">{func.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatAbiItem(func as any)}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 右侧函数调用区域 */}
      <div className="flex-1 p-6">
        {selectedFunction ? (
          <div className="space-y-6">
            {/* 函数信息 */}
            <div>
              <h2 className="text-xl font-semibold">{selectedFunction.name}</h2>
              <p className="text-sm text-gray-500">
                {formatAbiItem(selectedFunction as any)}
              </p>
            </div>

            {/* 函数调用表单 */}
            <FunctionForm
              contractAddress={contract.address}
              abi={parsedAbi}
              functionName={selectedFunction.name}
              inputs={selectedFunction.inputs}
              outputs={selectedFunction.outputs}
              stateMutability={selectedFunction.stateMutability}
            />

            {/* 交易详情 */}
            {activeTransaction && (
              <TransactionDetails
                hash={activeTransaction}
                onClose={() => setActiveTransaction(undefined)}
              />
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            请选择要调用的函数
          </div>
        )}
      </div>
    </div>
  )
} 