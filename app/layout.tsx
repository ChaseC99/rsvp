import './globals.css'
import type { Metadata } from 'next'
import Navbar from './navbar'

export const metadata: Metadata = {
  title: {
    template: '%s | RSVP',
    default: 'RSVP',
  },
  description: 'RSVP for events',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div style={{padding: "1.5rem"}}>
          {children}
        </div>
      </body>
    </html>
  )
}
