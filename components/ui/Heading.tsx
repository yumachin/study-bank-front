import { APP_VIEWS, AppView } from "@/types"

type HeadingProps = {
  currentView: AppView
}

export const Heading = ({ currentView }: HeadingProps) => {
  const VIEW_META: Record<AppView, { heading: string; description: string }> = {
    [APP_VIEWS.TIMER]: {
      heading: "",
      description: "",
    },
    [APP_VIEWS.WALLET]: {
      heading: "残高",
      description: "収益の管理と使用",
    },
    [APP_VIEWS.ANALYSIS]: {
      heading: "分析",
      description: "あなたの学習パフォーマンス",
    },
    [APP_VIEWS.SETTINGS]: {
      heading: "設定",
      description: "カスタマイズして、任意レートに調整",
    },
  }

  const { heading, description } = VIEW_META[currentView]

  return (
    <header className="mb-6 flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="text-slate-500 text-xs">{description}</p>
    </header>
  )
}