import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Syncopate', 'Inter', 'sans-serif'],
            },
            colors: {
                'lambo-black': '#000000',
                'lambo-silver': '#C0C0C0',
                'lambo-gold': '#D4AF37',
            },
            letterSpacing: {
                'ultra-wide': '0.3em',
            },
        },
    },
    plugins: [],
}
export default config
