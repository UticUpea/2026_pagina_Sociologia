"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';

// =============================================
// INTERFACES
// =============================================
interface PortadaData {
   portada_id: number;
   portada_imagen: string;
   portada_titulo: string;
   portada_subtitulo: string;
}

interface InstitucionData {
   institucion_id: number;
   institucion_nombre: string;
   institucion_historia: string;
   institucion_logo: string;
   portada?: PortadaData[];
   colorinstitucion?: Array<{
      id_color: number;
      color_primario: string;
      color_secundario: string;
      color_terciario: string;
   }>;
}

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

// ✅ IDs DE PORTADAS ALEATORIAS (238, 239, 240)
const PORTADA_IDS_RANDOM = [238, 239, 240];

// =============================================
// UTILIDADES - Manejo Inteligente de Imágenes
// =============================================

/**
 * Construye URL completa para imágenes de portadas y logos
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta según tipo
 */
const buildImageUrl = (
  imagePath: string | null | undefined,
  type: 'portada' | 'logo' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' | 'autoridad' = 'portada'
): string => {
  if (!imagePath) return '/assets/img/sociologia3.jpg';
  
  const cleanPath = imagePath.trim();
  
  // ✅ CASO 1: Ya es URL completa (MinIO o externo) → NO modificar
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  
  // ✅ CASO 2: Ruta relativa /storage/... → Agregar API_BASE_URL
  if (cleanPath.startsWith('/storage/')) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  
  // ✅ CASO 3: UUID o filename → Construir URL con carpeta según tipo
  const typeFolders: Record<string, string> = {
    portada: '/storage/imagenes/portadas/',
    logo: '/storage/imagenes/logos/',
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    gaceta: '/storage/imagenes/gacetas/',
    autoridad: '/storage/imagenes/autoridades/'
  };
  
  const folder = typeFolders[type] || '/storage/imagenes/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const Banner: React.FC = () => {
   const [data, setData] = useState<InstitucionData | null>(null);
   const [portadaUrl, setPortadaUrl] = useState<string>('');
   const [logoUrl, setLogoUrl] = useState<string>('');
   const [loading, setLoading] = useState<boolean>(true);
   const [colors, setColors] = useState({
      primario: '#FD1C0A',
      secundario: '#FAB265',
      terciario: '#050504'
   });

   // ✅ FUNCIÓN PARA SELECCIONAR PORTADA RANDOM (IDs 238-240)
   const getRandomPortada = (portadas: PortadaData[]): PortadaData | null => {
      const portadasFiltradas = portadas.filter(p => 
         PORTADA_IDS_RANDOM.includes(p.portada_id)
      );
      
      if (portadasFiltradas.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * portadasFiltradas.length);
      return portadasFiltradas[randomIndex];
   };

   useEffect(() => {
      const fetchData = async () => {
         try {
            console.log('🔄 [Banner] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            // ✅ URL y headers con variables de entorno
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/contenido`;
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
            };
            
            if (API_TOKEN) {
               headers['Authorization'] = `Bearer ${API_TOKEN}`;
            }
            
            const response = await fetch(url, { 
               method: 'GET', 
               headers,
               cache: 'no-store'
            });
            
            if (response.ok) {
               const result = await response.json();
               
               const portadaArray = result?.portada || [];
               console.log('📊 [Banner] Total portadas:', portadaArray.length);
               
               const portadaRandom = getRandomPortada(portadaArray);
               
               if (portadaRandom) {
                  console.log('🎲 [Banner] Portada seleccionada (random):', {
                     id: portadaRandom.portada_id,
                     titulo: portadaRandom.portada_titulo
                  });
                  
                  // ✅ Construir URL de portada inteligente
                  const fullUrl = buildImageUrl(portadaRandom.portada_imagen, 'portada');
                  console.log('🖼️ [Banner] URL de portada:', fullUrl);
                  setPortadaUrl(fullUrl);
               } else {
                  console.warn('⚠️ [Banner] No se encontraron portadas con IDs 238-240, usando fallback');
                  setPortadaUrl('/assets/img/sociologia3.jpg');
               }
               
               // ✅ Construir URL de logo inteligente
               if (result.institucion_logo) {
                  const logoFullUrl = buildImageUrl(result.institucion_logo, 'logo');
                  console.log('🎨 [Banner] Logo URL:', logoFullUrl);
                  setLogoUrl(logoFullUrl);
               }
               
               setData(result);
               
               // Colores institucionales
               if (result.colorinstitucion && result.colorinstitucion.length > 0) {
                  const colorScheme = result.colorinstitucion.find((c: any) => c.id_color === 32) || 
                                     result.colorinstitucion[0];
                  setColors({
                     primario: colorScheme.color_primario || '#FD1C0A',
                     secundario: colorScheme.color_secundario || '#FAB265',
                     terciario: colorScheme.color_terciario || '#050504'
                  });
               }
            } else {
               console.warn(`⚠️ [Banner] Error ${response.status}, usando fallback`);
               setPortadaUrl('/assets/img/sociologia3.jpg');
            }
            
            setLoading(false);
            
         } catch (error) {
            console.error('❌ [Banner] Error:', error);
            setPortadaUrl('/assets/img/sociologia3.jpg');
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const historiaLimpia = data?.institucion_historia 
      ? DOMPurify.sanitize(data.institucion_historia).replace(/<[^>]*>/g, '').substring(0, 150) + '...'
      : 'La Universidad Pública de El Alto, forjando profesionales.';

   // =============================================
   // ESTILOS - RESPONSIVE SIN CONFLICTOS CSS 🎨
   // =============================================
   const bannerStyles = {
      container: {
         // ✅ CORREGIDO: Usar backgroundImage (no background) para evitar conflictos
         backgroundImage: portadaUrl 
            ? `url("${portadaUrl}")`
            : `linear-gradient(135deg, ${colors.terciario} 0%, ${colors.primario} 50%, ${colors.secundario} 100%)`,
         backgroundSize: 'cover',
         backgroundPosition: 'center center',
         backgroundRepeat: 'no-repeat',
         backgroundAttachment: 'scroll',
         position: 'relative' as const,
         overflow: 'hidden' as const,
         minHeight: '600px',
         display: 'flex',
         alignItems: 'center',
         padding: '80px 20px',
         transition: 'background-image 0.3s ease'
      },
      content: {
         position: 'relative' as const,
         zIndex: 1
      },
      logoWrapper: {
         position: 'relative' as const,
         display: 'inline-block'
      },
      logoImage: {
         filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))'
      },
      subtitle: {
         color: '#FFFFFF',
         fontSize: '1.1rem',
         fontWeight: 500,
         marginBottom: '1.5rem',
         lineHeight: 1.6,
         textShadow: '0 2px 8px rgba(0,0,0,0.8)'
      },
      title: {
         color: '#FFFFFF',
         fontSize: '4rem',
         fontWeight: 900,
         marginBottom: '2rem',
         lineHeight: 1.1,
         textShadow: '0 4px 20px rgba(0,0,0,0.8)'
      },
      buttonPrimary: {
         background: `linear-gradient(135deg, ${colors.secundario}, #FFD700)`,
         color: colors.terciario,
         padding: '16px 36px',
         borderRadius: '20px',
         fontWeight: 800,
         fontSize: '13px',
         letterSpacing: '1px',
         textTransform: 'uppercase' as const,
         border: '3px solid rgba(255,255,255,0.4)',
         boxShadow: '0 8px 24px rgba(250,178,101,0.5)',
         transition: 'all 0.4s ease',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '10px',
         marginRight: '16px',
         textDecoration: 'none'
      },
      buttonSecondary: {
         background: 'rgba(255,255,255,0.15)',
         color: '#FFFFFF',
         padding: '16px 36px',
         borderRadius: '20px',
         fontWeight: 800,
         fontSize: '13px',
         letterSpacing: '1px',
         textTransform: 'uppercase' as const,
         border: '3px solid rgba(255,255,255,0.5)',
         backdropFilter: 'blur(10px)',
         boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
         transition: 'all 0.4s ease',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '10px',
         textDecoration: 'none'
      },
      loading: {
         background: `linear-gradient(135deg, ${colors.terciario} 0%, ${colors.primario} 100%)`,
         minHeight: '600px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center'
      }
   };

   if (loading) {
      return (
         <div className="banner-area banner-area-1" style={bannerStyles.loading}>
            <div className="text-center">
               <div className="spinner-border" role="status" style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  borderWidth: '4px',
                  borderColor: '#FAB265',
                  borderRightColor: 'transparent'
               }}>
                  <span className="visually-hidden">Cargando...</span>
               </div>
               <p className="mt-4" style={{ color: '#FFFFFF', fontSize: '1.1rem' }}>
                  Conectando con: {API_BASE_URL}
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="banner-area banner-area-1" style={bannerStyles.container}>
         {/* Overlay muy sutil solo para mejorar legibilidad del texto */}
         <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.15)',
            zIndex: 0
         }} />
         
         <div className="container" style={bannerStyles.content}>
            <div className="row justify-content-center align-items-center">
               {/* Logo */}
               <div className="col-lg-5 col-md-8 order-lg-12 text-center text-lg-end">
                  <div style={bannerStyles.logoWrapper}>
                     {logoUrl ? (
                        <Image 
                           src={logoUrl} 
                           alt={data?.institucion_nombre || 'Logo UPEA'}
                           width={420}
                           height={420}
                           style={{ 
                              width: '100%', 
                              height: 'auto',
                              maxWidth: '420px',
                              ...bannerStyles.logoImage
                           }}
                           // ✅ No optimizar si es URL externa (MinIO)
                           unoptimized={logoUrl.startsWith('http')}
                           onError={(e) => {
                              console.error('❌ Error cargando logo:', logoUrl);
                              const target = e.target as HTMLImageElement;
                              target.src = '/assets/img/logo-fallback.png';
                           }}
                           loading="eager"
                        />
                     ) : (
                        <Image 
                           src="/assets/img/logo-sociologia.png"
                           alt="Logo Sociología UPEA"
                           width={420}
                           height={420}
                           style={{ 
                              width: '100%', 
                              height: 'auto',
                              maxWidth: '420px',
                              ...bannerStyles.logoImage
                           }}
                        />
                     )}
                  </div>
               </div>
               
               {/* Contenido */}
               <div className="col-lg-7 order-lg-1 text-center text-lg-start">
                  <div className="banner-inner mt-5 mt-lg-0">
                     <h6 style={bannerStyles.subtitle}>
                        {historiaLimpia}
                     </h6>
                     
                     <h1 style={bannerStyles.title}>
                        {data?.institucion_nombre || 'SOCIOLOGÍA'}
                        <span style={{
                           display: 'block',
                           fontSize: '2rem',
                           fontWeight: 400,
                           color: colors.secundario,
                           marginTop: '8px',
                           letterSpacing: '2px',
                           textTransform: 'uppercase' as const
                        }}>
                           Universidad Pública de El Alto
                        </span>
                     </h1>
                     
                     <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '12px' }}>
                        <Link 
                           className="ed-btn btn-base"
                           href="/about"
                           style={bannerStyles.buttonPrimary}
                        >
                           <i className="fa fa-users"></i> AUTORIDADES
                        </Link>
                        
                        <Link 
                           className="ed-btn"
                           href="/"
                           style={bannerStyles.buttonSecondary}
                        >
                           <i className="fa fa-link"></i> ENLACES
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
         <style jsx global>{`
            @keyframes shimmer {
               0% { background-position: -1000px 0; }
               100% { background-position: 1000px 0; }
            }
            .banner-area::before {
               content: '';
               position: absolute;
               top: -50%;
               left: -1000px;
               width: 2000px;
               height: 200%;
               background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
               transform: rotate(15deg);
               animation: shimmer 12s infinite linear;
               pointer-events: none;
               z-index: 0;
            }
            
            /* =============================================
               RESPONSIVE DESIGN - BANNER
               ============================================= */
            
            /* Tablet */
            @media (max-width: 991px) {
               .banner-area {
                  min-height: 500px !important;
                  padding: 60px 20px !important;
               }
               
               .banner-area h1 {
                  font-size: 3rem !important;
               }
               
               .banner-area .btn {
                  padding: 14px 30px !important;
                  font-size: 12px !important;
               }
            }
            
            /* Móvil */
            @media (max-width: 767px) {
               .banner-area {
                  min-height: 400px !important;
                  padding: 50px 15px !important;
               }
               
               .banner-area h1 {
                  font-size: 2.2rem !important;
                  margin-bottom: 1rem !important;
               }
               
               .banner-area h1 span {
                  font-size: 1.4rem !important;
                  margin-top: 6px !important;
               }
               
               .banner-area h6 {
                  font-size: 0.95rem !important;
                  margin-bottom: 1rem !important;
               }
               
               .banner-area .btn {
                  width: 100%;
                  margin: 8px 0 !important;
                  padding: 12px 20px !important;
                  font-size: 0.9rem !important;
                  justify-content: center;
               }
               
               .banner-area .banner-inner {
                  margin-top: 30px !important;
               }
               
               .banner-area .col-lg-5,
               .banner-area .col-lg-7 {
                  text-align: center !important;
               }
               
               .banner-area .order-lg-12 {
                  order: 1 !important;
                  margin-bottom: 20px;
               }
               
               .banner-area .order-lg-1 {
                  order: 2 !important;
               }
            }
            
            /* Móvil pequeño */
            @media (max-width: 576px) {
               .banner-area {
                  min-height: 350px !important;
                  padding: 40px 10px !important;
               }
               
               .banner-area h1 {
                  font-size: 1.6rem !important;
               }
               
               .banner-area h1 span {
                  font-size: 1.1rem !important;
               }
               
               .banner-area h6 {
                  font-size: 0.85rem !important;
               }
               
               .banner-area .btn {
                  padding: 10px 16px !important;
                  font-size: 0.85rem !important;
               }
               
               .banner-area img {
                  max-width: 300px !important;
                  margin: 0 auto;
               }
            }
         `}</style>
      </div>
   );
};

export default Banner;