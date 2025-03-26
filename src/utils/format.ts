export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatBalance(balance: string, decimals: number = 18): string {
  if (!balance) return '0'
  return (Number(balance) / 10 ** decimals).toFixed(4)
} 