export interface Action {
  title: string
  desc: string
  type: string
  action: string
  emoji: boolean
  emojiChar?: string
  keycheck: boolean
  keys?: string[]
  url?: string
  favIconUrl?: string
}
