import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Proximo Brand Muscle | Creative Customization Platform',
  description: 'Empower field teams to adapt brand creative for local markets while maintaining brand integrity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-proximo-cream">
        {children}
      </body>
    </html>
  )
}
