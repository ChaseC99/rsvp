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
        <div style={{padding: "1.5rem"}}>
          {children}
        </div>
      </body>
    </html>
  )
}
