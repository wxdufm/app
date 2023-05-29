import './globals.css'
import './app.css'
// import { Inter, Merriweather, Poppins } from 'next/font/google'
import Header from '@/components/header'
import { GoogleFonts } from 'next-google-fonts';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <GoogleFonts href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" />
        <header>
          <Header/>
        </header>
        <main style={{fontFamily: "Poppins"}}>
          {children}
        </main>
 
    </>
  )
}
