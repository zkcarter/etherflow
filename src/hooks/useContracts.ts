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
        setContracts(result.data)
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
        setContracts(prev => [...prev, newContract])
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
      const result = await contractStorage.update(id, updates)
      if (result.success && result.data) {
        setContracts(prev =>
          prev.map(contract =>
            contract.id === id ? { ...contract, ...updates, updatedAt: Date.now() } : contract
          )
        )
        return { success: true, data: result.data }
      } else {
        setError(result.message || '更新合约失败')
        return { success: false, message: result.message }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      setError(message)
      return { success: false, message }
    }
  }, [])

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
    loadContracts,
  }
} 