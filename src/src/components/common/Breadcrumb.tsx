"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

// =============================================
// INTERFACES
// =============================================
interface PortadaData {
   portada_id: number;
   portada_imagen: string;
   portada_titulo: string;
   portada_subtitulo: string;
}

interface BreadcrumbProps {
   title: string;
   sub_title: string;
}

// =============================================
// CONFIGURACIÓN - URLs DIRECTAS SIN PROXY
// =============================================
const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const INSTITUCION_ID = "35";

// ✅ IDs DE PORTADAS ALEATORIAS (238, 239, 240)
const PORTADA_IDS_RANDOM = [238, 239, 240];

// =============================================
// UTILIDADES
// =============================================

// ✅ FUNCIÓN PARA SELECCIONAR PORTADA RANDOM (IDs 238-240)
const getRandomPortada = (portadas: PortadaData[]): PortadaData | null => {
   const portadasFiltradas = portadas.filter(p => 
      PORTADA_IDS_RANDOM.includes(p.portada_id)
   );
   
   if (portadasFiltradas.length === 0) return null;
   
   const randomIndex = Math.floor(Math.random() * portadasFiltradas.length);
   return portadasFiltradas[randomIndex];
};

// ✅ CONSTRUIR URL DE PORTADA
const buildPortadaUrl = (imagenPath: string | null | undefined): string => {
   if (!imagenPath) return '/assets/img/sociologia3.jpg';
   const cleanPath = imagenPath.trim();
   if (cleanPath.startsWith('http')) return cleanPath;
   if (cleanPath.startsWith('/storage/')) return `${API_BASE_URL}${cleanPath}`;
   return `${API_BASE_URL}/storage/imagenes/portadas/${cleanPath}`;
};

// =============================================
// COMPONENTE - CONSUMIENDO PORTADA RANDOM ✨
// =============================================
const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, sub_title }) => {
   const [portadaUrl, setPortadaUrl] = useState<string>('/assets/img/sociologia3.jpg');
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchPortada = async () => {
         try {
            console.log('🔄 [Breadcrumb] Cargando portada desde:', 
               `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/contenido`);
            
            const response = await fetch(
               `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/contenido`,
               {
                  method: 'GET',
                  headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${API_TOKEN}`
                  },
                  cache: 'no-store'
               }
            );
            
            if (response.ok) {
               const result = await response.json();
               const portadaArray = result?.portada || [];
               
               console.log('📊 [Breadcrumb] Total portadas:', portadaArray.length);
               
               const portadaRandom = getRandomPortada(portadaArray);
               
               if (portadaRandom) {
                  console.log('🎲 [Breadcrumb] Portada seleccionada (random):', {
                     id: portadaRandom.portada_id,
                     titulo: portadaRandom.portada_titulo
                  });
                  
                  const fullUrl = buildPortadaUrl(portadaRandom.portada_imagen);
                  console.log('🖼️ [Breadcrumb] URL de portada:', fullUrl);
                  setPortadaUrl(fullUrl);
               } else {
                  console.warn('⚠️ [Breadcrumb] No se encontraron portadas con IDs 238-240, usando fallback');
                  setPortadaUrl('/assets/img/sociologia3.jpg');
               }
            } else {
               console.warn(`⚠️ [Breadcrumb] Error ${response.status}, usando fallback`);
               setPortadaUrl('/assets/img/sociologia3.jpg');
            }
         } catch (error) {
            console.error('❌ [Breadcrumb] Error cargando portada:', error);
            setPortadaUrl('/assets/img/sociologia3.jpg');
         } finally {
            setLoading(false);
         }
      };

      fetchPortada();
   }, []);

   // =============================================
   // ESTILOS - CORREGIDO: backgroundImage sin conflictos 🎨
   // =============================================
   const breadcrumbStyles = {
      container: {
         position: 'relative' as const,
         // ✅ CORREGIDO: Usar backgroundImage (no background) para evitar conflictos
         backgroundImage: `url("${portadaUrl}")`,
         backgroundSize: 'cover',
         backgroundPosition: 'center center',
         backgroundAttachment: 'scroll',
         backgroundRepeat: 'no-repeat',
         backgroundColor: '#050504',
         minHeight: '450px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         overflow: 'hidden' as const,
         transition: 'background-image 0.3s ease'
      },
      overlay: {
         position: 'absolute' as const,
         top: 0,
         left: 0,
         right: 0,
         bottom: 0,
         background: 'rgba(0,0,0,0.15)',
         zIndex: 1
      },
      content: {
         position: 'relative' as const,
         zIndex: 3,
         textAlign: 'center' as const,
         animation: 'fadeInUp 0.8s ease forwards',
         opacity: 0
      },
      title: {
         color: '#FFFFFF',
         fontSize: '3.5rem',
         fontWeight: 800,
         marginBottom: '1.5rem',
         textShadow: '0 4px 20px rgba(0,0,0,0.8)',
         position: 'relative' as const,
         display: 'inline-block',
         letterSpacing: '-0.5px'
      },
      titleLine: {
         position: 'absolute' as const,
         bottom: '-12px',
         left: '50%',
         transform: 'translateX(-50%)',
         width: '100px',
         height: '5px',
         background: 'linear-gradient(90deg, transparent, #FAB265, #FD1C0A, #FAB265, transparent)',
         borderRadius: '3px',
         boxShadow: '0 2px 10px rgba(250,178,101,0.5)'
      },
      list: {
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         gap: '12px',
         listStyle: 'none',
         margin: 0,
         padding: 0,
         flexWrap: 'wrap' as const
      },
      listItem: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '1rem',
         fontWeight: 500,
         display: 'flex',
         alignItems: 'center',
         gap: '12px',
         transition: 'all 0.3s ease'
      },
      homeLink: {
         color: '#FAB265',
         textDecoration: 'none',
         fontWeight: 600,
         display: 'inline-flex',
         alignItems: 'center',
         gap: '6px',
         padding: '8px 16px',
         borderRadius: '10px',
         background: 'rgba(250,178,101,0.15)',
         border: '2px solid rgba(250,178,101,0.3)',
         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
         backdropFilter: 'blur(10px)'
      },
      homeLinkHover: {
         background: 'rgba(250,178,101,0.3)',
         borderColor: '#FAB265',
         transform: 'translateY(-2px)',
         boxShadow: '0 6px 20px rgba(250,178,101,0.4)',
         color: '#FFFFFF'
      },
      separator: {
         color: '#FAB265',
         fontSize: '0.9rem',
         opacity: 0.8
      },
      currentPage: {
         color: '#FFFFFF',
         fontWeight: 700,
         padding: '8px 20px',
         borderRadius: '10px',
         background: 'rgba(253,28,10,0.3)',
         border: '2px solid rgba(253,28,10,0.5)',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '6px',
         backdropFilter: 'blur(10px)',
         boxShadow: '0 4px 12px rgba(253,28,10,0.3)'
      }
   };

   return (
      <div className="breadcrumb-area" style={breadcrumbStyles.container}>
         <div style={breadcrumbStyles.overlay} />
         
         <div className="container" style={breadcrumbStyles.content}>
            <div className="breadcrumb-inner">
               <div className="section-title mb-0 text-center">
                  <h2 className="page-title" style={breadcrumbStyles.title}>
                     {title}
                     <span style={breadcrumbStyles.titleLine} />
                  </h2>
                  
                  <ul className="page-list" style={breadcrumbStyles.list}>
                     <li style={breadcrumbStyles.listItem}>
                        <Link 
                           href="/"
                           style={breadcrumbStyles.homeLink}
                           onMouseEnter={(e: any) => {
                              Object.assign(e.currentTarget.style, breadcrumbStyles.homeLinkHover);
                           }}
                           onMouseLeave={(e: any) => {
                              Object.assign(e.currentTarget.style, breadcrumbStyles.homeLink);
                           }}
                        >
                           <i className="fa fa-home"></i>
                           Inicio
                        </Link>
                     </li>
                     
                     <li style={breadcrumbStyles.separator}>
                        <i className="fa fa-chevron-right"></i>
                     </li>
                     
                     <li style={breadcrumbStyles.currentPage}>
                        <i className="fa fa-folder-open"></i>
                        {sub_title}
                     </li>
                  </ul>
               </div>
            </div>
         </div>
         
         <style jsx global>{`
            @keyframes fadeInUp {
               from {
                  opacity: 0;
                  transform: translateY(30px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }
            
            .breadcrumb-area {
               position: relative;
            }
            
            .breadcrumb-area .page-title {
               animation: fadeInUp 0.8s ease forwards;
               animation-delay: 0.2s;
               opacity: 0;
            }
            
            .breadcrumb-area .page-list {
               animation: fadeInUp 0.8s ease forwards;
               animation-delay: 0.4s;
               opacity: 0;
            }
            
            /* =============================================
               RESPONSIVE DESIGN - BREADCRUMB
               ============================================= */
            
            /* Tablet */
            @media (max-width: 991px) {
               .breadcrumb-area {
                  min-height: 350px !important;
                  padding: 40px 20px !important;
               }
               
               .breadcrumb-area .page-title {
                  font-size: 2.5rem !important;
               }
               
               .breadcrumb-area .page-list {
                  gap: 8px !important;
               }
            }
            
            /* Móvil */
            @media (max-width: 767px) {
               .breadcrumb-area {
                  min-height: 300px !important;
                  padding: 30px 15px !important;
               }
               
               .breadcrumb-area .page-title {
                  font-size: 2rem !important;
                  margin-bottom: 1rem !important;
               }
               
               .breadcrumb-area .page-title span {
                  width: 80px !important;
                  bottom: -10px !important;
               }
               
               .breadcrumb-area .page-list {
                  flex-direction: column !important;
                  gap: 8px !important;
               }
               
               .breadcrumb-area .page-list li:nth-child(2) {
                  display: none !important;
               }
               
               .breadcrumb-area .homeLink,
               .breadcrumb-area .currentPage {
                  padding: 6px 14px !important;
                  font-size: 0.9rem !important;
               }
            }
            
            /* Móvil pequeño */
            @media (max-width: 576px) {
               .breadcrumb-area {
                  min-height: 250px !important;
                  padding: 25px 10px !important;
               }
               
               .breadcrumb-area .page-title {
                  font-size: 1.5rem !important;
               }
               
               .breadcrumb-area .page-title span {
                  width: 60px !important;
                  height: 4px !important;
               }
               
               .breadcrumb-area .homeLink,
               .breadcrumb-area .currentPage {
                  padding: 5px 12px !important;
                  font-size: 0.85rem !important;
               }
            }
         `}</style>
      </div>
   );
};

export default Breadcrumb;