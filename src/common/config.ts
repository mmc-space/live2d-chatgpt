import { app } from 'electron'
import Store from 'electron-store'

const store = new Store<{
  alwaysOnTop: boolean
  ignoreMouseEvents: boolean
  language: 'zh' | 'en'
}>({
  name: 'ppet-config',
  defaults: {
    alwaysOnTop: true,
    ignoreMouseEvents: false,
    language: app.getLocale().includes('en') ? 'en' : 'zh',
  },
})

export default store
