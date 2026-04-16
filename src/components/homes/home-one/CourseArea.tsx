"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image'; // ✅ IMPORTANTE: Asegurar import de Image
import { CSSProperties } from 'react';

// =============================================
// INTERFACES - PARA LINKS EXTERNOS/INTERNOS
// =============================================
interface LinkItem {
   id_link: number;
   imagen: string;
   nombre: string;
   url_link: string;
   estado: number;
   tipo: string;
}

interface ApiResponse {
   upea_publicaciones?: any[];
   linksExternoInterno: LinkItem[];
   links?: any[];
}

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

// =============================================
// UTILIDADES - Manejo Inteligente de Imágenes
// =============================================

/**
 * Construye URL completa para imágenes de enlaces
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta de links
 */
const buildImageUrl = (
  imagePath: string | null | undefined,
  type: 'link' | 'portada' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' | 'autoridad' = 'link'
): string => {
  if (!imagePath) return '/images/placeholder-link.png';
  
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
    link: '/storage/imagenes/links/',
    portada: '/storage/imagenes/portadas/',
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    gaceta: '/storage/imagenes/gacetas/',
    autoridad: '/storage/imagenes/autoridades/'
  };
  
  const folder = typeFolders[type] || '/storage/imagenes/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

const cleanUrl = (url: string): string => {
   return url.trim().replace(/\s+/g, '');
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const CourseArea: React.FC = () => {
   const [links, setLinks] = useState<LinkItem[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // =============================================
   // CARGAR DATOS DESDE API - CON VARIABLES DE ENTORNO
   // =============================================
   useEffect(() => {
      const fetchLinks = async () => {
         try {
            console.log('🔄 [CourseArea] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            // ✅ URL y headers con variables de entorno
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/recursos`;
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
            
            console.log('📥 [CourseArea] Respuesta:', {
               status: response.status,
               ok: response.ok
            });
            
            if (response.ok) {
               const data: ApiResponse = await response.json();
               
               // ✅ Extraer linksExternoInterno (filtrar solo activos)
               const activeLinks = (data.linksExternoInterno || [])
                  .filter((link: LinkItem) => link.estado === 1)
                  .map((link: LinkItem) => ({
                     ...link,
                     url_link: cleanUrl(link.url_link)
                  }));
               
               console.log(`✅ [CourseArea] ${activeLinks.length} enlaces activos cargados`);
               setLinks(activeLinks);
            } else {
               console.warn(`⚠️ [CourseArea] Error ${response.status}`);
               setLinks([]);
            }
            
            setLoading(false);
            
         } catch (err: any) {
            console.error("❌ [CourseArea] Error:", err?.message);
            setError(err?.message || "Error de conexión con el servidor");
            setLinks([]);
            setLoading(false);
         }
      };

      fetchLinks();
   }, []);

   // =============================================
   // ESTILOS VISUALES
   // =============================================
   const courseStyles = {
      section: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         position: 'relative' as const,
         overflow: 'hidden' as const,
         padding: '100px 0'
      },
      decorativeBg: {
         position: 'absolute' as const,
         top: '-150px',
         right: '-150px',
         width: '400px',
         height: '400px',
         background: 'radial-gradient(circle, rgba(250,178,101,0.12) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      decorativeBg2: {
         position: 'absolute' as const,
         bottom: '-100px',
         left: '-100px',
         width: '350px',
         height: '350px',
         background: 'radial-gradient(circle, rgba(253,28,10,0.12) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      header: {
         position: 'relative' as const,
         zIndex: 1,
         marginBottom: '4rem'
      },
      sectionSubtitle: {
         color: '#FAB265',
         fontWeight: 700,
         fontSize: '0.85rem',
         textTransform: 'uppercase',
         letterSpacing: '2px',
         marginBottom: '0.75rem',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px',
         padding: '8px 18px',
         background: 'rgba(250,178,101,0.15)',
         borderRadius: '20px',
         border: '2px solid rgba(250,178,101,0.4)',
         backdropFilter: 'blur(10px)'
      } as CSSProperties,
      sectionTitle: {
         color: '#FFFFFF',
         fontSize: '2.5rem',
         fontWeight: 800,
         marginBottom: '0.75rem',
         position: 'relative' as const,
         display: 'inline-block',
         textShadow: '0 4px 16px rgba(250,178,101,0.4)'
      } as CSSProperties,
      sectionTitleLine: {
         position: 'absolute' as const,
         bottom: '-10px',
         left: '50%',
         transform: 'translateX(-50%)',
         width: '80px',
         height: '4px',
         background: 'linear-gradient(90deg, #FAB265, #FD1C0A)',
         borderRadius: '2px'
      } as CSSProperties,
      sectionDescription: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '1rem',
         marginTop: '1.5rem'
      } as CSSProperties,
      card: { 
         background: 'rgba(255,255,255,0.08)',
         borderRadius: '20px',
         boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
         border: '2px solid rgba(250,178,101,0.2)',
         overflow: 'hidden' as const,
         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
         height: '100%',
         display: 'flex',
         flexDirection: 'column' as const,
         backdropFilter: 'blur(10px)',
         cursor: 'pointer'
      } as CSSProperties,
      cardHover: {
         transform: 'translateY(-12px)',
         boxShadow: '0 20px 48px rgba(250,178,101,0.25)',
         borderColor: 'rgba(250,178,101,0.5)',
         background: 'rgba(255,255,255,0.12)'
      } as CSSProperties,
      imageWrapper: {
         position: 'relative' as const,
         width: '100%',
         height: '180px',
         overflow: 'hidden',
         background: 'linear-gradient(135deg, rgba(253,28,10,0.2), rgba(250,178,101,0.2))',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         padding: '20px'
      } as CSSProperties,
      image: {
         maxWidth: '100%',
         maxHeight: '100%',
         objectFit: 'contain',
         filter: 'brightness(0) invert(1)',
         transition: 'transform 0.4s ease, filter 0.3s ease'
      } as CSSProperties,
      badge: {
         position: 'absolute' as const,
         top: '12px',
         right: '12px',
         background: 'linear-gradient(135deg, #FAB265, #FFD700)',
         color: '#050504',
         padding: '6px 14px',
         borderRadius: '10px',
         fontWeight: 700,
         fontSize: '0.7rem',
         textTransform: 'uppercase',
         letterSpacing: '0.5px',
         zIndex: 2,
         boxShadow: '0 4px 12px rgba(250,178,101,0.4)',
         backdropFilter: 'blur(10px)'
      } as CSSProperties,
      content: {
         padding: '28px',
         flex: 1,
         display: 'flex',
         flexDirection: 'column' as const
      } as CSSProperties,
      title: {
         color: '#FFFFFF',
         fontSize: '1.25rem',
         fontWeight: 700,
         marginBottom: '16px',
         lineHeight: 1.4,
         textAlign: 'center' as const,
         textShadow: '0 2px 8px rgba(0,0,0,0.4)'
      } as CSSProperties,
      footer: {
         paddingTop: '20px',
         borderTop: '2px solid rgba(250,178,101,0.2)',
         display: 'flex',
         justifyContent: 'center',
         marginTop: 'auto'
      } as CSSProperties,
      button: {
         background: 'linear-gradient(135deg, #FD1C0A, #cc1608)',
         color: '#FFFFFF',
         padding: '12px 28px',
         borderRadius: '12px',
         fontWeight: 700,
         fontSize: '0.9rem',
         textDecoration: 'none',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px',
         boxShadow: '0 4px 12px rgba(253, 28, 10, 0.4)',
         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
         border: '2px solid transparent'
      } as CSSProperties,
      buttonHover: {
         transform: 'translateY(-2px)',
         boxShadow: '0 8px 20px rgba(253, 28, 10, 0.5)',
         background: 'transparent',
         color: '#FAB265',
         borderColor: '#FAB265'
      } as CSSProperties,
      externalIcon: {
         fontSize: '0.8rem',
         marginLeft: '4px'
      } as CSSProperties,
      loading: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         minHeight: '600px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center'
      } as CSSProperties,
      emptyState: {
         background: 'rgba(255,255,255,0.05)',
         border: '2px dashed rgba(250,178,101,0.3)',
         borderRadius: '20px',
         padding: '60px 40px',
         textAlign: 'center' as const
      } as CSSProperties,
      emptyIcon: {
         fontSize: '4rem',
         color: '#FAB265',
         marginBottom: '20px',
         opacity: 0.6
      } as CSSProperties
   };

   // =============================================
   // RENDERIZADO
   // =============================================
   
   if (loading) {
      return (
         <section className="course-area pd-top-100 pd-bottom-90" style={courseStyles.section}>
            <div style={courseStyles.decorativeBg} />
            <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
               <div style={{
                  width: '70px',
                  height: '70px',
                  border: '5px solid rgba(250,178,101,0.3)',
                  borderTop: '5px solid #FAB265',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 24px'
               }} />
               <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '8px' }}>
                  Cargando Enlaces
               </h3>
               <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                  Conectando con: {API_BASE_URL}
               </p>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="course-area pd-top-100 pd-bottom-90" style={courseStyles.section}>
            <div className="container">
               <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px solid #FD1C0A',
                  borderRadius: '20px',
                  padding: '40px',
                  textAlign: 'center',
                  maxWidth: '600px',
                  margin: '0 auto'
               }}>
                  <i className="fa fa-exclamation-triangle" style={{ 
                     fontSize: '3.5rem', 
                     color: '#FD1C0A',
                     marginBottom: '20px',
                     display: 'block'
                  }}></i>
                  <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                     ⚠️ Error al Cargar
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: '24px' }}>{error}</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '24px' }}>
                     API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                  </p>
                  <button 
                     onClick={() => window.location.reload()}
                     style={{
                        background: 'linear-gradient(135deg, #FD1C0A, #cc1608)',
                        color: '#FFFFFF',
                        padding: '14px 32px',
                        borderRadius: '14px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                     }}
                     onMouseEnter={(e: any) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 10px 28px rgba(253,28,10,0.5)';
                     }}
                     onMouseLeave={(e: any) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                     }}
                  >
                     <i className="fa fa-refresh"></i> Reintentar
                  </button>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section className="course-area pd-top-100 pd-bottom-90" style={courseStyles.section}>
         {/* Elementos decorativos de fondo */}
         <div style={courseStyles.decorativeBg} />
         <div style={courseStyles.decorativeBg2} />
         
         <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Header de Sección */}
            <div className="row justify-content-center mb-4" style={courseStyles.header}>
               <div className="col-xl-8 text-center">
                  
                  {/* SOCIOLOGÍA - Título Principal ARRIBA */}
                  <h2 className="title mb-4" style={{
                     ...courseStyles.sectionTitle,
                     display: 'block',
                     marginBottom: '1.5rem'
                  }}>
                     SOCIOLOGÍA
                     <span style={courseStyles.sectionTitleLine} />
                  </h2>
                  
                  {/* RECURSOS ACADÉMICOS - Subtítulo ABAJO */}
                  <div style={{
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     marginBottom: '1rem'
                  }}>
                     <h6 className="sub-title" style={{
                        ...courseStyles.sectionSubtitle,
                        display: 'inline-flex',
                        marginBottom: 0
                     }}>
                        <i className="fa fa-link"></i>
                        RECURSOS ACADÉMICOS
                     </h6>
                  </div>
                  
                  {/* Descripción */}
                  <p className="text-muted small mt-3" style={courseStyles.sectionDescription}>
                     <i className="fa fa-database me-2"></i>
                     API: {API_BASE_URL} | Institución: {INSTITUCION_ID}
                  </p>
                  
               </div>
            </div>

            {/* Grid de Enlaces */}
            <div className="row g-4 justify-content-center">
               {links.length === 0 ? (
                  <div className="col-12">
                     <div style={courseStyles.emptyState}>
                        <i className="fa fa-link" style={courseStyles.emptyIcon}></i>
                        <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                           Sin Enlaces Disponibles
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
                           Los enlaces de recursos se mostrarán aquí cuando la administración los publique.
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '1rem' }}>
                           API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                        </p>
                     </div>
                  </div>
               ) : (
                  links.map((link, index) => {
                     // ✅ Construir URL de imagen inteligente
                     const imageUrl = buildImageUrl(link.imagen, 'link');
                     // ✅ Detectar si es URL externa para unoptimized
                     const isExternalImage = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
                     
                     return (
                        <div 
                           key={link.id_link} 
                           className="col-lg-4 col-md-6"
                           style={{
                              animation: 'fadeInUp 0.6s ease forwards',
                              opacity: 0,
                              animationDelay: `${index * 0.15}s`
                           }}
                        >
                           <article 
                              className="single-course-inner"
                              style={courseStyles.card}
                              onMouseEnter={(e: any) => {
                                 Object.assign(e.currentTarget.style, courseStyles.cardHover);
                                 const img = e.currentTarget.querySelector('.link-image');
                                 if (img) Object.assign(img.style, { transform: 'scale(1.1)' });
                              }}
                              onMouseLeave={(e: any) => {
                                 Object.assign(e.currentTarget.style, {
                                    transform: 'translateY(0)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    borderColor: 'rgba(250,178,101,0.2)',
                                    background: 'rgba(255,255,255,0.08)'
                                 });
                                 const img = e.currentTarget.querySelector('.link-image');
                                 if (img) Object.assign(img.style, { transform: 'scale(1)' });
                              }}
                           >
                              {/* Imagen del enlace */}
                              <div className="thumb" style={courseStyles.imageWrapper}>
                                 {/* ✅ REEMPLAZADO: <img> → <Image /> de Next.js */}
                                 <Image
                                    src={imageUrl}
                                    alt={link.nombre}
                                    width={200}
                                    height={180}
                                    className="link-image"
                                    style={{ 
                                       ...courseStyles.image,
                                       maxWidth: '100%',
                                       maxHeight: '100%',
                                       objectFit: 'contain',
                                       filter: isExternalImage ? 'none' : 'brightness(0) invert(1)',
                                       transition: 'transform 0.4s ease, filter 0.3s ease'
                                    }}
                                    // ✅ No optimizar si es URL externa (MinIO)
                                    unoptimized={isExternalImage}
                                    // ✅ Fallback si la imagen falla
                                    onError={(e) => {
                                       const target = e.target as HTMLImageElement;
                                       target.src = '/images/placeholder-link.png';
                                    }}
                                    loading="lazy"
                                 />
                                 
                                 {/* Badge de Tipo */}
                                 {link.tipo && (
                                    <span style={courseStyles.badge}>
                                       {link.tipo}
                                    </span>
                                 )}
                              </div>
                              
                              {/* Contenido */}
                              <div className="details" style={courseStyles.content}>
                                 <h6 className="title mb-2" style={courseStyles.title}>
                                    {link.nombre}
                                 </h6>
                                 
                                 {/* Botón de acceso */}
                                 <div className="mt-auto pt-3" style={courseStyles.footer}>
                                    <a
                                       href={link.url_link}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       style={courseStyles.button}
                                       onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, courseStyles.buttonHover)}
                                       onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, courseStyles.button)}
                                    >
                                       Acceder <i className="fa fa-external-link" style={courseStyles.externalIcon}></i>
                                    </a>
                                 </div>
                              </div>
                           </article>
                        </div>
                     );
                  })
               )}
            </div>
         </div>
         
         {/* CSS Global para animaciones */}
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
            
            @keyframes spin {
               from { transform: rotate(0deg); }
               to { transform: rotate(360deg); }
            }
            
            .course-area .single-course-inner {
               will-change: transform, box-shadow, background;
            }
            
            @media (max-width: 991px) {
               .course-area {
                  padding: 60px 0 !important;
               }
               .section-title {
                  font-size: 2rem !important;
               }
            }
            
            @media (max-width: 767px) {
               .course-area {
                  padding: 50px 0 !important;
               }
               .section-title {
                  font-size: 1.75rem !important;
               }
            }
         `}</style>
      </section>
   );
};

export default CourseArea;