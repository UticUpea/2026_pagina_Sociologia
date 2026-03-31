// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ✅ Aquí pones las fuentes globales */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Rubik:300,400,400i,500,600,700i&display=swap"
        />
        {/* ✅ Aquí puedes agregar meta tags globales si quieres */}
        <meta
          name="description"
          content="Edumint – Education LMS & Online Courses React Next.js Template."
        />
        <link rel="icon" href="/logo-artes-foother.png" sizes="any" />
      </Head>
      <body className="sc5">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
