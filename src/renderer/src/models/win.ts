import { createModel } from '@rematch/core'
import { RootModel } from '.'

const config = window.bridge.getConfig() || {}

export const win = createModel<RootModel>()({
  state: {
    resizable: window.bridge.isWinResizable(),
    language: config.language ?? 'zh',
  } as { resizable: boolean; language: 'zh' | 'en' },
  reducers: {
    setResizable: (state, resizable: boolean) => {
      window.bridge.setWinResizable(resizable)
      return { ...state, resizable }
    },
    setLanguage: (state, language: 'zh' | 'en') => {
      return { ...state, language }
    },
  },
})
