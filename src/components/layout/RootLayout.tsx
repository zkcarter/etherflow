import { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">EtherFlow</h1>
            {/* 网络选择器将在这里 */}
          </div>
          <div className="flex items-center gap-4">
            {/* 钱包连接按钮将在这里 */}
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="container flex min-h-screen gap-6 pt-20">
        {/* 左侧边栏 */}
        <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto lg:block">
          <nav className="flex flex-col gap-2">
            {/* 已保存的合约列表将在这里 */}
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 pb-8">
          {children}
        </main>
      </div>
    </div>
  )
} 