/** @type {import('next').NextConfig} */
const nextConfig = {
  // Seguridad: Ocultar X-Powered-By
  poweredByHeader: false,
  
  // Modo estricto de React
  reactStrictMode: true,
  
  // Compresión habilitada
  compress: true,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https: blob:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://apiadministrador.upea.bo https://archivosminio.upea.bo;
              frame-src 'self' https://www.youtube.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'self';
            `.replace(/\s{2,}/g, ' ').trim()
          },
          
          // X-Frame-Options (Anti-Clickjacking)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          
          // X-Content-Type-Options (Prevenir MIME sniffing)
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          
          // X-XSS-Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          
          // Referrer-Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          
          // Permissions-Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          
          // Ocultar X-Powered-By
          {
            key: 'X-Powered-By',
            value: ''
          }
        ]
      }
    ];
  },
  
  // Configuración de imágenes remotas (MinIO)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apiadministrador.upea.bo',
        pathname: '/storage/imagenes/**',
      },
      {
        protocol: 'https',
        hostname: 'archivosminio.upea.bo',
        pathname: '/archivospaginasnode/**',
      },
    ],
  },
}

module.exports = nextConfig