import type { Config } from 'tailwindcss'
import notionTailwindPreset from './frameworks/react-ts/tailwind.preset'

const config: Config = {
  presets: [notionTailwindPreset as Config],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './frameworks/react-ts/**/*.{ts,tsx}',
  ],
}

export default config
