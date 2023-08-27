import './globals.css'
import type { Metadata } from 'next'
import Navbar from './navbar'

export const metadata: Metadata = {
  title: 'RSVP',
  description: 'RSVP for events',
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
        {children}
      </body>
    </html>
  )
}
