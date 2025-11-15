import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    theme: {
        fontfamily: {
            sans: ["Inter", "system-ui", "sans-serif"],
            serif: ['Merriweather', 'serif'],
            mono: ['Fira Code', 'monospace'],
        }
    }
}
)