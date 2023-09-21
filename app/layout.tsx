import './globals.css'
import type { Metadata } from 'next'
import Navbar from './navbar'
import Head from 'next/head'

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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <body>
        <Navbar />
        <div style={{padding: "1.5rem"}}>
          {children}
        </div>
      </body>
    </html>
  )
}
