import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ContractConfig } from '../types/contract'
import { contractStorage } from '../services/storage'

export function useContracts() {
  const [contracts, setContracts] = useState<ContractConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载所有合约
  const loadContracts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await contractStorage.getAll()
      if (result.success && result.data) {
        // 按收藏状态和更新时间排序
        const sortedContracts = [...result.data].sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) return -1
          if (!a.isFavorite && b.isFavorite) return 1
          return b.updatedAt - a.updatedAt
        })
        setContracts(sortedContracts)
      } else {
        setError(result.message || '加载合约失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }, [])

  // 添加新合约
  const addContract = useCallback(async (
    name: string,
    address: string,
    abi: string,
    description?: string
  ) => {
    try {
      setError(null)
      const newContract: ContractConfig = {
        id: uuidv4(),
        name,
        address,
        abi,
        description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
      }

      const result = await contractStorage.save(newContract)
      if (result.success) {
        setContracts(prev => {
          const newContracts = [...prev, newContract]
          return newContracts.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1
            if (!a.isFavorite && b.isFavorite) return 1
            return b.updatedAt - a.updatedAt
          })
        })
        return { success: true, data: newContract }
      } else {
        setError(result.message || '添加合约失败')
        return { success: false, message: result.message }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      setError(message)
      return { success: false, message }
    }
  }, [])

  // 更新合约
  const updateContract = useCallback(async (
    id: string,
    updates: Partial<ContractConfig>
  ) => {
    try {
      setError(null)
      const contract = contracts.find(c => c.id === id)
      if (!contract) {
        throw new Error('合约不存在')
      }

      const updatedContract = {
        ...contract,
        ...updates,
        updatedAt: Date.now()
      }

      const result = await contractStorage.update(id, updatedContract)
      if (result.success) {
        setContracts(prev => {
          const newContracts = prev.map(c => c.id === id ? updatedContract : c)
          return newContracts.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1
            if (!a.isFavorite && b.isFavorite) return 1
            return b.updatedAt - a.updatedAt
          })
        })
        return { success: true, data: updatedContract }
      } else {
        setError(result.message || '更新合约失败')
        return { success: false, message: result.message }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      setError(message)
      return { success: false, message }
    }
  }, [contracts])

  // 删除合约
  const deleteContract = useCallback(async (id: string) => {
    try {
      setError(null)
      const result = await contractStorage.delete(id)
      if (result.success) {
        setContracts(prev => prev.filter(contract => contract.id !== id))
        return { success: true }
      } else {
        setError(result.message || '删除合约失败')
        return { success: false, message: result.message }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      setError(message)
      return { success: false, message }
    }
  }, [])

  // 切换收藏状态
  const toggleFavorite = useCallback(async (id: string) => {
    const contract = contracts.find(c => c.id === id)
    if (contract) {
      return updateContract(id, { isFavorite: !contract.isFavorite })
    }
    return { success: false, message: '合约不存在' }
  }, [contracts, updateContract])

  // 重新排序合约
  const reorderContracts = useCallback(async (newContracts: ContractConfig[]) => {
    try {
      setError(null)
      // 更新所有合约的顺序
      const updatePromises = newContracts.map(async (contract, index) => {
        const updatedContract = {
          ...contract,
          updatedAt: Date.now() - index // 使用减法确保顺序正确
        }
        return contractStorage.update(contract.id, updatedContract)
      })

      const results = await Promise.all(updatePromises)
      const hasError = results.some(result => !result.success)

      if (!hasError) {
        setContracts(newContracts)
        return { success: true }
      } else {
        setError('重新排序失败')
        return { success: false, message: '重新排序失败' }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      setError(message)
      return { success: false, message }
    }
  }, [])

  // 初始加载
  useEffect(() => {
    loadContracts()
  }, [loadContracts])

  return {
    contracts,
    loading,
    error,
    addContract,
    updateContract,
    deleteContract,
    toggleFavorite,
    reorderContracts,
    loadContracts,
  }
} 