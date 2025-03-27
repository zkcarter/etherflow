import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Textarea'
import { Alert, AlertDescription } from '../ui/Alert'

interface ContractDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (contract: { name: string; address: string; abi: string }) => void
}

function validateAbi(abiString: string): { isValid: boolean; error?: string } {
  try {
    // 尝试解析 ABI 字符串
    const parsedAbi = JSON.parse(abiString)

    // 检查是否为数组
    if (!Array.isArray(parsedAbi)) {
      // 如果不是数组，检查是否为包含 abi 字段的对象
      if (typeof parsedAbi === 'object' && parsedAbi !== null && Array.isArray(parsedAbi.abi)) {
        return { isValid: true }
      }
      return { isValid: false, error: 'ABI 必须是一个数组或包含 abi 字段的对象' }
    }

    // 检查数组是否为空
    if (parsedAbi.length === 0) {
      return { isValid: false, error: 'ABI 数组不能为空' }
    }

    // 检查每个项目是否为有效的 ABI 项
    for (const item of parsedAbi) {
      if (typeof item !== 'object' || item === null) {
        return { isValid: false, error: 'ABI 中的每一项必须是对象' }
      }

      // 检查必要的字段
      if (!item.type) {
        return { isValid: false, error: 'ABI 项必须包含 type 字段' }
      }

      // 检查函数类型的项
      if (item.type === 'function') {
        if (!item.name || !item.inputs || !Array.isArray(item.inputs) || !item.outputs || !Array.isArray(item.outputs)) {
          return { isValid: false, error: '函数类型的 ABI 项必须包含 name、inputs 和 outputs 字段' }
        }
      }

      // 检查事件类型的项
      if (item.type === 'event') {
        if (!item.name || !item.inputs || !Array.isArray(item.inputs)) {
          return { isValid: false, error: '事件类型的 ABI 项必须包含 name 和 inputs 字段' }
        }
      }
    }

    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: 'ABI 格式无效：无法解析 JSON' }
  }
}

export function ContractDialog({ open, onOpenChange, onSave }: ContractDialogProps) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [abi, setAbi] = useState('')
  const [error, setError] = useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 验证 ABI
    const validation = validateAbi(abi)
    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    // 清除错误
    setError(undefined)

    // 保存合约
    onSave({ name, address, abi })

    // 重置表单
    setName('')
    setAddress('')
    setAbi('')

    // 关闭对话框
    onOpenChange(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const validation = validateAbi(text)
      if (!validation.isValid) {
        setError(validation.error)
        return
      }

      setAbi(text)
      setError(undefined)
    } catch (error) {
      setError('无法读取文件')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加合约</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              名称
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              地址
            </label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              pattern="^0x[a-fA-F0-9]{40}$"
              title="请输入有效的以太坊地址"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="abi" className="text-sm font-medium">
              ABI
            </label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="flex-1"
              />
            </div>
            <Textarea
              id="abi"
              value={abi}
              onChange={(e) => setAbi(e.target.value)}
              required
              rows={10}
              placeholder="请粘贴 ABI JSON 或上传 JSON 文件"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 