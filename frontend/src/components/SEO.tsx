import React from 'react'
import { Helmet } from 'react-helmet-async'

interface Props {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
}

export function SEO({ 
  title = 'Seleste — High Impact Growth Audit for Local Businesses',
  description = 'Stop losing revenue to technical debt and missed opportunities. Seleste provides real-time growth intelligence for your business.',
  image = '/og-image.png',
  url = 'https://seleste.app',
  type = 'website'
}: Props) {
  const fullTitle = title.includes('Seleste') ? title : `${title} | Seleste`
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Facebook / Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
