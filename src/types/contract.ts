/**
 * 合约配置接口
 */
export interface ContractConfig {
  /** 唯一标识符 */
  id: string
  /** 合约名称 */
  name: string
  /** 合约地址 */
  address: string
  /** 合约 ABI */
  abi: string
  /** 创建时间 */
  createdAt: number
  /** 更新时间 */
  updatedAt: number
  /** 备注 */
  description?: string
  /** 是否是收藏的合约 */
  isFavorite?: boolean
}

/**
 * 合约函数接口
 */
export interface ContractFunction {
  /** 函数名称 */
  name: string
  /** 函数类型：读操作或写操作 */
  type: 'read' | 'write'
  /** 函数输入参数 */
  inputs: FunctionInput[]
  /** 函数输出参数（读操作） */
  outputs?: FunctionOutput[]
  /** 状态可变性 */
  stateMutability: string
  /** 函数签名 */
  signature: string
}

/**
 * 函数输入参数接口
 */
export interface FunctionInput {
  /** 参数名称 */
  name: string
  /** 参数类型 */
  type: string
  /** 参数描述（来自 NatSpec） */
  description?: string
  /** 复合类型的组件 */
  components?: FunctionInput[]
}

/**
 * 函数输出参数接口
 */
export interface FunctionOutput {
  /** 输出名称 */
  name: string
  /** 输出类型 */
  type: string
  /** 输出描述（来自 NatSpec） */
  description?: string
  /** 复合类型的组件 */
  components?: FunctionOutput[]
}

/**
 * 合约存储操作结果
 */
export interface ContractStorageResult {
  success: boolean
  message?: string
  data?: any
} 