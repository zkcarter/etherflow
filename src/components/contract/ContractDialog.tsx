import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog'
import { ContractForm } from './ContractForm'
import { ContractConfig } from '../../types/contract'

interface ContractDialogProps {
  isOpen: boolean
  onClose: () => void
  contract?: ContractConfig
  onSubmit: (name: string, address: string, abi: string, description?: string) => Promise<void>
}

export function ContractDialog({ 
  isOpen, 
  onClose, 
  contract,
  onSubmit
}: ContractDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {contract ? '编辑合约' : '添加合约'}
          </DialogTitle>
        </DialogHeader>
        <ContractForm
          contract={contract}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
} 