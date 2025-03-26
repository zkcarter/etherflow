import { useState } from 'react'
import { Button } from '../ui/Button'
import { ContractConfig } from '../../types/contract'
import { ethers } from 'ethers'

interface ContractFormProps {
  contract?: ContractConfig
  onSubmit: (name: string, address: string, abi: string, description?: string) => Promise<void>
  onCancel: () => void
}

export function ContractForm({ contract, onSubmit, onCancel }: ContractFormProps) {
  const [name, setName] = useState(contract?.name || '')
  const [address, setAddress] = useState(contract?.address || '')
  const [abi, setAbi] = useState(contract?.abi || '')
  const [description, setDescription] = useState(contract?.description || '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 验证合约地址
  const validateAddress = (address: string) => {
    try {
      return ethers.isAddress(address)
    } catch {
      return false
    }
  }

  // 验证 ABI
  const validateABI = (abi: string) => {
    try {
      JSON.parse(abi)
      return true
    } catch {
      return false
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 验证表单
    if (!name.trim()) {
      setError('请输入合约名称')
      return
    }

    if (!validateAddress(address)) {
      setError('请输入有效的合约地址')
      return
    }

    if (!validateABI(abi)) {
      setError('请输入有效的 ABI')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(name.trim(), address, abi, description.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 合约名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          合约名称
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入合约名称"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 合约地址 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          合约地址
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="输入合约地址"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 合约 ABI */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          合约 ABI
        </label>
        <textarea
          value={abi}
          onChange={(e) => setAbi(e.target.value)}
          placeholder="粘贴合约 ABI"
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          备注
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入备注信息（可选）"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      {/* 按钮组 */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  )
} 