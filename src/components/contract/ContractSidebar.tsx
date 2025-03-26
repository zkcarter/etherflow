import { useState, useEffect } from 'react'
import { formatAddress } from '../../utils/format'
import { ChevronLeft, ChevronRight, Star, StarOff, Trash2, Edit, Plus, GripVertical } from 'lucide-react'
import { Button } from '../ui/Button'
import { ContractDialog } from './ContractDialog'
import { ContractConfig } from '../../types/contract'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ContractSidebarProps {
  contracts: ContractConfig[]
  selectedContract?: ContractConfig
  onSelectContract: (contract: ContractConfig) => void
  onToggleFavorite: (contractId: string) => Promise<{ success: boolean; data?: ContractConfig }>
  onDeleteContract: (contractId: string) => Promise<{ success: boolean }>
  onAddContract: (name: string, address: string, abi: string, description?: string) => Promise<{ success: boolean; data?: ContractConfig }>
  onUpdateContract: (id: string, updates: Partial<ContractConfig>) => Promise<{ success: boolean; data?: ContractConfig }>
  onReorder: (contracts: ContractConfig[]) => Promise<void>
}

interface SortableContractItemProps {
  contract: ContractConfig
  isCollapsed: boolean
  selectedContract?: ContractConfig
  onSelect: (contract: ContractConfig) => void
  onToggleFavorite: (contractId: string) => Promise<{ success: boolean; data?: ContractConfig }>
  onDelete: (contractId: string) => Promise<{ success: boolean }>
  onEdit: (contract: ContractConfig) => void
}

function SortableContractItem({
  contract,
  isCollapsed,
  selectedContract,
  onSelect,
  onToggleFavorite,
  onDelete,
  onEdit,
}: SortableContractItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: contract.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-2 p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer
        ${selectedContract?.id === contract.id ? 'bg-gray-50' : ''}
      `}
      onClick={() => onSelect(contract)}
    >
      {/* 拖拽手柄 */}
      <Button
        variant="ghost"
        size="sm"
        className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 shrink-0"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} className="text-gray-400" />
      </Button>

      {/* 收藏图标 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={async (e) => {
          e.stopPropagation()
          const result = await onToggleFavorite(contract.id)
          if (result.success && result.data && selectedContract?.id === contract.id) {
            onSelect(result.data)
          }
        }}
        className={`shrink-0 ${contract.isFavorite ? '' : 'opacity-0 group-hover:opacity-100'}`}
      >
        {contract.isFavorite ? (
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
        ) : (
          <StarOff size={16} className="text-gray-400" />
        )}
      </Button>

      {/* 合约信息 */}
      {!isCollapsed && (
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="font-medium truncate">{contract.name}</div>
          <div className="text-sm text-gray-500 truncate">
            {formatAddress(contract.address)}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {!isCollapsed && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(contract)
            }}
            className="text-gray-400 hover:text-blue-500"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async (e) => {
              e.stopPropagation()
              const result = await onDelete(contract.id)
              if (result.success && selectedContract?.id === contract.id) {
                onSelect(undefined as any)
              }
            }}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}

export function ContractSidebar({
  contracts,
  selectedContract,
  onSelectContract,
  onToggleFavorite,
  onDeleteContract,
  onAddContract,
  onUpdateContract,
  onReorder
}: ContractSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<ContractConfig | undefined>()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 对合约进行分组：收藏的和非收藏的
  const favoriteContracts = contracts.filter(c => c.isFavorite)
  const nonFavoriteContracts = contracts.filter(c => !c.isFavorite)

  // 处理编辑合约
  const handleEdit = (contract: ContractConfig) => {
    setEditingContract(contract)
    setIsDialogOpen(true)
  }

  // 处理添加合约
  const handleAdd = () => {
    setEditingContract(undefined)
    setIsDialogOpen(true)
  }

  // 处理对话框关闭
  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingContract(undefined)
  }

  // 处理合约保存
  const handleContractSave = async (
    name: string,
    address: string,
    abi: string,
    description?: string
  ) => {
    try {
      let result;
      if (editingContract) {
        result = await onUpdateContract(editingContract.id, {
          name,
          address,
          abi,
          description,
        })
      } else {
        result = await onAddContract(name, address, abi, description)
      }

      if (result.success && result.data) {
        if (selectedContract?.id === result.data.id) {
          onSelectContract(result.data)
        }
      }
      handleDialogClose()
    } catch (error) {
      console.error('保存合约失败:', error)
      throw error
    }
  }

  // 处理拖拽结束
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = contracts.findIndex(c => c.id === active.id)
    const newIndex = contracts.findIndex(c => c.id === over.id)
    
    const oldContract = contracts[oldIndex]
    const newContract = contracts[newIndex]
    
    // 如果收藏状态不同，不允许排序
    if (oldContract.isFavorite !== newContract.isFavorite) return
    
    const newContracts = arrayMove(contracts, oldIndex, newIndex)
    await onReorder(newContracts)
  }

  return (
    <>
      <div className={`
        flex flex-col border-r border-gray-200 bg-white h-full
        ${isCollapsed ? 'w-16' : ''}
      `}>
        {/* 顶部标题和收缩按钮 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && <h2 className="text-lg font-semibold">合约列表</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        {/* 合约列表 */}
        <div className="flex-1 overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* 收藏的合约 */}
            {favoriteContracts.length > 0 && (
              <div>
                <SortableContext
                  items={favoriteContracts.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {favoriteContracts.map(contract => (
                    <SortableContractItem
                      key={contract.id}
                      contract={contract}
                      isCollapsed={isCollapsed}
                      selectedContract={selectedContract}
                      onSelect={onSelectContract}
                      onToggleFavorite={onToggleFavorite}
                      onDelete={onDeleteContract}
                      onEdit={handleEdit}
                    />
                  ))}
                </SortableContext>
              </div>
            )}

            {/* 非收藏的合约 */}
            {nonFavoriteContracts.length > 0 && (
              <div>
                <SortableContext
                  items={nonFavoriteContracts.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {nonFavoriteContracts.map(contract => (
                    <SortableContractItem
                      key={contract.id}
                      contract={contract}
                      isCollapsed={isCollapsed}
                      selectedContract={selectedContract}
                      onSelect={onSelectContract}
                      onToggleFavorite={onToggleFavorite}
                      onDelete={onDeleteContract}
                      onEdit={handleEdit}
                    />
                  ))}
                </SortableContext>
              </div>
            )}
          </DndContext>
        </div>

        {/* 底部添加按钮 */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleAdd}
            className={`
              w-full bg-blue-500 hover:bg-blue-600 text-white
              flex items-center justify-center gap-2
            `}
          >
            <Plus size={20} />
            {!isCollapsed && <span>添加合约</span>}
          </Button>
        </div>
      </div>

      {/* 合约表单对话框 */}
      <ContractDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        contract={editingContract}
        onSubmit={handleContractSave}
      />
    </>
  )
} 