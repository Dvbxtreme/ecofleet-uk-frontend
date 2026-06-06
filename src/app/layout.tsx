import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import AppShell from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'EcoFleet UK — Carbon Reporting for Fleet Operators',
  description: 'FORS-ready, DEFRA-compliant CO₂e reporting',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#1a365d" />
      </head>
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}
