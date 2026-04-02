import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export const SEO: React.FC<SEOProps> = ({ 
  title = "Seleste — Website Growth Audit for Local Business", 
  description = "Get a high-speed intelligence deep-scan of your website. We identify revenue leaks and provide a 90-day growth roadmap for Main Street businesses.",
  image = "https://seleste-app-7jcj.vercel.app/og-image.png",
  url = "https://seleste.io"
}) => {
  const siteTitle = title.includes("Seleste") ? title : `${title} | Seleste`

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Favicon & Theme */}
      <link rel="icon" href="/favicon.ico" />
      <meta name="theme-color" content="#0a0a0f" />
    </Helmet>
  )
}
