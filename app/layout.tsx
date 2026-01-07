import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Lamborghini Aventador | Beyond Gravity',
    description: 'Experience the Lamborghini Aventador like never before. Scroll to witness the V12 masterpiece explode into its mechanical glory.',
    keywords: ['Lamborghini', 'Aventador', 'V12', 'Supercar', 'Luxury', 'Italian Engineering'],
    authors: [{ name: 'Lamborghini' }],
    openGraph: {
        title: 'Lamborghini Aventador | Beyond Gravity',
        description: 'Scroll to witness the V12 masterpiece explode into its mechanical glory.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}
