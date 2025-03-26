export interface Contract {
  id: string
  name: string
  address: string
  abi: string
  createdAt: number
  updatedAt: number
}

export interface ContractFunction {
  name: string
  type: 'read' | 'write'
  inputs: FunctionInput[]
  outputs?: FunctionOutput[]
  stateMutability: string
  signature: string
}

export interface FunctionInput {
  name: string
  type: string
  components?: FunctionInput[]
}

export interface FunctionOutput {
  name: string
  type: string
  components?: FunctionOutput[]
} 