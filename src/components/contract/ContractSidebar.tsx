import { useState } from 'react'
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

// 可排序的合约项组件
function SortableContractItem({
  contract,
  isSelected,
  onSelect,
  onToggleFavorite,
  onEdit,
  onDelete,
}: {
  contract: ContractConfig
  isSelected: boolean
  onSelect: () => void
  onToggleFavorite: () => void
  onEdit: () => void
  onDelete: () => void
}) {
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
        flex items-center gap-2 p-4 cursor-pointer
        ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}
        border-b border-gray-200
      `}
    >
      <div {...attributes} {...listeners}>
        <GripVertical size={20} className="text-gray-400" />
      </div>
      <div className="flex-1" onClick={onSelect}>
        <div className="font-medium">{contract.name}</div>
        <div className="text-sm text-gray-500">
          {formatAddress(contract.address)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFavorite}
        >
          {contract.isFavorite ? (
            <Star size={20} className="text-yellow-400" />
          ) : (
            <StarOff size={20} className="text-gray-400" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
        >
          <Edit size={20} className="text-gray-400" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 size={20} className="text-gray-400" />
        </Button>
      </div>
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

  // 处理合约保存
  const handleContractSave = async (contract: { name: string; address: string; abi: string }) => {
    try {
      let result;
      if (editingContract) {
        result = await onUpdateContract(editingContract.id, contract)
      } else {
        result = await onAddContract(contract.name, contract.address, contract.abi)
      }

      if (result.success && result.data) {
        if (selectedContract?.id === result.data.id) {
          onSelectContract(result.data)
        }
      }
      setIsDialogOpen(false)
      setEditingContract(undefined)
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
        ${isCollapsed ? 'w-16' : 'w-80'}
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
        {!isCollapsed && (
          <div className="flex-1 overflow-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {/* 收藏的合约 */}
              {favoriteContracts.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                    收藏的合约
                  </div>
                  <SortableContext
                    items={favoriteContracts.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {favoriteContracts.map((contract) => (
                      <SortableContractItem
                        key={contract.id}
                        contract={contract}
                        isSelected={selectedContract?.id === contract.id}
                        onSelect={() => onSelectContract(contract)}
                        onToggleFavorite={() => onToggleFavorite(contract.id)}
                        onEdit={() => handleEdit(contract)}
                        onDelete={() => onDeleteContract(contract.id)}
                      />
                    ))}
                  </SortableContext>
                </div>
              )}

              {/* 其他合约 */}
              {nonFavoriteContracts.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                    其他合约
                  </div>
                  <SortableContext
                    items={nonFavoriteContracts.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {nonFavoriteContracts.map((contract) => (
                      <SortableContractItem
                        key={contract.id}
                        contract={contract}
                        isSelected={selectedContract?.id === contract.id}
                        onSelect={() => onSelectContract(contract)}
                        onToggleFavorite={() => onToggleFavorite(contract.id)}
                        onEdit={() => handleEdit(contract)}
                        onDelete={() => onDeleteContract(contract.id)}
                      />
                    ))}
                  </SortableContext>
                </div>
              )}
            </DndContext>
          </div>
        )}

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
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleContractSave}
      />
    </>
  )
} 