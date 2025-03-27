import { useState, useEffect } from 'react'
import { useContractRead, useContractWrite, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Alert, AlertTitle, AlertDescription } from '../ui/Alert'
import { Loader2 } from 'lucide-react'

interface FunctionFormProps {
  contractAddress: string
  abi: any
  functionName: string
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
  stateMutability: string
}

type InputValue = string | string[] | { [key: string]: any }

export function FunctionForm({
  contractAddress,
  abi,
  functionName,
  inputs,
  outputs,
  stateMutability
}: FunctionFormProps) {
  const [inputValues, setInputValues] = useState<{ [key: string]: InputValue }>({})
  const [error, setError] = useState<string | null>(null)

  const isReadFunction = ['view', 'pure'].includes(stateMutability)

  // 合约读取
  const { 
    data: readData,
    isLoading: isReadLoading,
    isError: isReadError,
    refetch
  } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi,
    functionName,
    args: Object.values(inputValues),
    query: {
      enabled: isReadFunction && Object.keys(inputValues).length === inputs.length,
    }
  })

  // 合约写入模拟
  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName,
    args: Object.values(inputValues),
    query: {
      enabled: !isReadFunction && Object.keys(inputValues).length === inputs.length,
    }
  })

  // 合约写入
  const { 
    writeContract,
    data: writeData,
    isLoading: isWriteLoading,
    error: writeError
  } = useContractWrite()

  // 等待交易确认
  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt
  } = useWaitForTransactionReceipt({
    hash: writeData?.hash,
    query: {
      enabled: !!writeData?.hash,
    }
  })

  // 处理输入变化
  const handleInputChange = (name: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [name]: formatInputValue(value, inputs.find(input => input.name === name)?.type || '')
    }))
  }

  // 格式化输入值
  const formatInputValue = (value: string, type: string): InputValue => {
    try {
      if (type.includes('[]')) {
        return value.split(',').map(v => v.trim())
      } else if (type.startsWith('uint') || type.startsWith('int')) {
        return value // 数字类型保持字符串形式，由 ethers 处理转换
      } else if (type === 'bool') {
        return value.toLowerCase() === 'true'
      } else if (type.startsWith('bytes')) {
        return value.startsWith('0x') ? value : `0x${value}`
      } else if (type === 'address') {
        return value as `0x${string}`
      } else {
        return value
      }
    } catch (e) {
      console.error('输入格式化错误:', e)
      return value
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      if (isReadFunction) {
        await refetch()
      } else if (simulateData?.request) {
        await writeContract(simulateData.request)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '调用失败')
    }
  }

  // 格式化输出结果
  const formatOutput = (value: any): string => {
    if (typeof value === 'bigint') {
      return formatEther(value)
    } else if (Array.isArray(value)) {
      return value.map(formatOutput).join(', ')
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 输入参数 */}
      {inputs.map((input) => (
        <div key={input.name} className="space-y-2">
          <label className="text-sm font-medium">
            {input.name} ({input.type})
          </label>
          <Input
            value={inputValues[input.name] as string || ''}
            onChange={(e) => handleInputChange(input.name, e.target.value)}
            placeholder={`输入 ${input.type} 类型参数`}
          />
        </div>
      ))}

      {/* 错误提示 */}
      {(error || simulateError || writeError) && (
        <Alert variant="destructive">
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>
            {error || simulateError?.message || writeError?.message}
          </AlertDescription>
        </Alert>
      )}

      {/* 调用按钮 */}
      <Button
        type="submit"
        disabled={
          isReadLoading || 
          isWriteLoading || 
          isConfirming || 
          (!isReadFunction && !simulateData?.request)
        }
        className="w-full"
      >
        {isReadLoading || isWriteLoading || isConfirming ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isConfirming ? '确认中...' : '处理中...'}
          </>
        ) : (
          '调用函数'
        )}
      </Button>

      {/* 结果显示 */}
      {(readData || receipt) && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium">调用结果</h3>
          <pre className="whitespace-pre-wrap break-all rounded-lg bg-gray-50 p-4 text-sm">
            {isReadFunction
              ? formatOutput(readData)
              : `交易哈希: ${receipt?.transactionHash}`}
          </pre>
        </div>
      )}
    </form>
  )
} 