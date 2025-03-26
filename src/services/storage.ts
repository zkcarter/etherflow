import { ContractConfig, ContractStorageResult } from '../types/contract'

const DB_NAME = 'etherflow'
const DB_VERSION = 1
const STORE_NAME = 'contracts'

/**
 * 初始化 IndexedDB 数据库
 */
async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('无法打开数据库'))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      // 如果 'contracts' 对象仓库不存在，则创建它
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // 创建对象仓库，使用 id 作为键路径
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        // 创建索引
        store.createIndex('name', 'name', { unique: false })
        store.createIndex('address', 'address', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
        store.createIndex('updatedAt', 'updatedAt', { unique: false })
        store.createIndex('isFavorite', 'isFavorite', { unique: false })
      }
    }
  })
}

/**
 * 合约存储服务
 */
export const contractStorage = {
  /**
   * 保存合约配置
   */
  async save(contract: ContractConfig): Promise<ContractStorageResult> {
    try {
      const db = await initDB()
      return new Promise((resolve) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put(contract)

        request.onsuccess = () => {
          resolve({ success: true, data: contract })
        }

        request.onerror = () => {
          resolve({ success: false, message: '保存合约失败' })
        }
      })
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '未知错误' }
    }
  },

  /**
   * 获取所有合约配置
   */
  async getAll(): Promise<ContractStorageResult> {
    try {
      const db = await initDB()
      return new Promise((resolve) => {
        const transaction = db.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
          resolve({ success: true, data: request.result })
        }

        request.onerror = () => {
          resolve({ success: false, message: '获取合约列表失败' })
        }
      })
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '未知错误' }
    }
  },

  /**
   * 根据 ID 获取合约配置
   */
  async getById(id: string): Promise<ContractStorageResult> {
    try {
      const db = await initDB()
      return new Promise((resolve) => {
        const transaction = db.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.get(id)

        request.onsuccess = () => {
          if (request.result) {
            resolve({ success: true, data: request.result })
          } else {
            resolve({ success: false, message: '合约不存在' })
          }
        }

        request.onerror = () => {
          resolve({ success: false, message: '获取合约失败' })
        }
      })
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '未知错误' }
    }
  },

  /**
   * 删除合约配置
   */
  async delete(id: string): Promise<ContractStorageResult> {
    try {
      const db = await initDB()
      return new Promise((resolve) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = () => {
          resolve({ success: true })
        }

        request.onerror = () => {
          resolve({ success: false, message: '删除合约失败' })
        }
      })
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '未知错误' }
    }
  },

  /**
   * 更新合约配置
   */
  async update(id: string, updates: Partial<ContractConfig>): Promise<ContractStorageResult> {
    try {
      // 先获取现有合约
      const getResult = await this.getById(id)
      if (!getResult.success || !getResult.data) {
        return { success: false, message: '合约不存在' }
      }

      // 合并更新
      const updatedContract = {
        ...getResult.data,
        ...updates,
        updatedAt: Date.now(),
      }

      // 保存更新后的合约
      return this.save(updatedContract)
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '未知错误' }
    }
  },

  /**
   * 清空所有合约数据
   */
  async clear(): Promise<ContractStorageResult> {
    try {
      const db = await initDB()
      return new Promise((resolve) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.clear()

        request.onsuccess = () => {
          resolve({ success: true })
        }

        request.onerror = () => {
          resolve({ success: false, message: '清空合约数据失败' })
        }
      })
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '未知错误' }
    }
  },
} 