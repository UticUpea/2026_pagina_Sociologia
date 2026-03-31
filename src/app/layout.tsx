"use client"
import { Provider } from "react-redux"
import "../styles/index.scss"
import store from "@/redux/store"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="en" suppressHydrationWarning={isDev}>
      <head>
        <meta name="description" content="Edumint is a bootstrap 4+ Edumint – Education LMS & Online Courses React Next js Template. It has all the required tools and features to create a super-fast responsive Education website with an amazing UI and UX experience. 3 demo and blog, blog-single, course, course-single page layouts, and modern design-based skins allow you to create your own perfect website. You can avoid expensive web development and minimize your design costs using Edumint – Edumint LMS & Online Courses React Next js Template." />
        <link rel="icon" href="/logo-artes-foother.png" sizes="any" />
        
      </head>
      <body suppressHydrationWarning={true} className="sc5">
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  )
}
